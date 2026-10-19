import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Interval } from '@nestjs/schedule';
import { DataSource, LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { Contract, NonceManager, Wallet, ZeroAddress, isError } from 'ethers';
import { BlockchainService } from '../blockchain/blockchain.service.js';
import { uuidToUint } from '../blockchain/utilies/uuid.util.js';
import { debitLocked, toUnits, unlockFunds } from '../balances/balance-ops.js';
import { Withdrawal } from './withdrawal.entity.js';

const LOOKBACK_BLOCKS = 2000;

@Injectable()
export class WithdrawalsProcessor implements OnModuleInit {
  private readonly logger = new Logger(WithdrawalsProcessor.name);
  private running = false;
  private signer?: NonceManager;

  private readonly enabled: boolean;
  private readonly chainId: number;
  private readonly confirmations: number;
  private readonly stuckMs: number;
  private readonly maxAttempts: number;
  private readonly batchSize: number;

  constructor(
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
    private readonly blockchain: BlockchainService,
    @InjectRepository(Withdrawal)
    private readonly repo: Repository<Withdrawal>,
  ) {
    this.enabled = config.get('WITHDRAWALS_ENABLED') === 'true';
    this.chainId = Number(
      config.get('CHAIN_ID') ?? config.getOrThrow('SEPOLIA_CHAIN_ID'),
    );
    this.confirmations = Number(
      config.get('WITHDRAW_CONFIRMATIONS') ?? config.get('CONFIRMATIONS') ?? 2,
    );
    this.stuckMs = Number(config.get('WITHDRAW_STUCK_MINUTES') ?? 10) * 60_000;
    this.maxAttempts = Number(config.get('WITHDRAW_MAX_ATTEMPTS') ?? 5);
    this.batchSize = Number(config.get('WITHDRAW_BATCH') ?? 10);
  }

  async onModuleInit() {
    if (!this.enabled) return;

    try {
      await this.blockchain.factory.withdrawn(0);
      this.logger.log('withdrawals worker is on');
    } catch {
      this.logger.error(
        'FACTORY_ADDRESS is not the new DepositFactory (withdrawn() is missing): withdrawals will not work',
      );
    }
  }

  @Interval(15_000)
  async run() {
    if (!this.enabled || this.running) return;
    this.running = true;

    try {
      await this.reconcile();
      await this.processPending();
    } catch (err) {
      this.logger.error(`withdrawals run failed: ${(err as Error).message}`);
    } finally {
      this.running = false;
    }
  }

  private async processPending() {
    const due = await this.repo.find({
      where: {
        status: 'pending',
        chainId: this.chainId,
        nextAttemptAt: LessThanOrEqual(new Date()),
      },
      order: { createdAt: 'ASC' },
      take: this.batchSize,
    });

    for (const candidate of due) {
      try {
        await this.sendOne(candidate.id);
      } catch (err) {
        this.logger.error(
          `withdrawal ${candidate.id} failed unexpectedly: ${(err as Error).message}`,
        );
      }
    }
  }

  private async sendOne(id: string) {
    const claimed = await this.repo
      .createQueryBuilder()
      .update(Withdrawal)
      .set({ status: 'processing', attempts: () => 'attempts + 1' })
      .where('id = :id AND status = :status', { id, status: 'pending' })
      .execute();
    if (!claimed.affected) return;

    const withdrawal = await this.repo.findOne({ where: { id } });
    if (!withdrawal) return;

    const idUint = uuidToUint(withdrawal.id);
    const factory = this.writableFactory();

    if (await factory.withdrawn(idUint)) {
      await this.completePaidOnChain(withdrawal);
      return;
    }

    const amount = toUnits(withdrawal.amount);
    const pool = await this.blockchain.provider.getBalance(
      await factory.getAddress(),
    );
    if (pool < amount) {
      this.logger.warn(
        `pool has ${pool} wei, withdrawal ${withdrawal.id} needs ${amount}: fund the factory`,
      );
      await this.retryLater(withdrawal, 'Not enough funds in the pool', true);
      return;
    }

    try {
      const tx = await factory.withdraw(
        idUint,
        ZeroAddress,
        withdrawal.toAddress,
        amount,
      );

      await this.repo.update(
        { id: withdrawal.id },
        {
          status: 'sent',
          txHash: tx.hash,
          sentAt: new Date(),
          lastError: null,
        },
      );
      this.logger.log(`withdrawal ${withdrawal.id} sent (tx ${tx.hash})`);
    } catch (err) {
      this.signer?.reset();

      const infrastructure =
        isError(err, 'INSUFFICIENT_FUNDS') ||
        isError(err, 'NETWORK_ERROR') ||
        isError(err, 'TIMEOUT') ||
        isError(err, 'SERVER_ERROR');

      await this.retryLater(
        withdrawal,
        (err as Error).message ?? 'Send failed',
        infrastructure,
      );
    }
  }

  private async reconcile() {
    const provider = this.blockchain.provider;
    const factory = this.blockchain.factory;

    const sent = await this.repo.find({
      where: { status: 'sent', chainId: this.chainId },
      order: { sentAt: 'ASC' },
      take: 50,
    });

    for (const w of sent) {
      try {
        const idUint = uuidToUint(w.id);
        const receipt = w.txHash
          ? await provider.getTransactionReceipt(w.txHash)
          : null;

        if (receipt) {
          if (receipt.status === 1) {
            const latest = await provider.getBlockNumber();
            if (latest - receipt.blockNumber + 1 >= this.confirmations) {
              await this.complete(w.id, w.txHash);
            }
            continue;
          }

          if (await factory.withdrawn(idUint)) {
            await this.completePaidOnChain(w);
          } else {
            await this.failWithRefund(w.id, 'Transaction reverted');
          }
          continue;
        }

        const sentAt = w.sentAt?.getTime() ?? 0;
        if (Date.now() - sentAt < this.stuckMs) continue;

        if (await factory.withdrawn(idUint)) {
          await this.completePaidOnChain(w);
        } else {
          await this.backToPending(
            w.id,
            'Transaction was not mined, sending again',
          );
        }
      } catch (err) {
        this.logger.error(
          `could not follow withdrawal ${w.id}: ${(err as Error).message}`,
        );
      }
    }

    const stale = await this.repo.find({
      where: {
        status: 'processing',
        chainId: this.chainId,
        updatedAt: LessThan(new Date(Date.now() - this.stuckMs)),
      },
      take: 50,
    });

    for (const w of stale) {
      try {
        if (await factory.withdrawn(uuidToUint(w.id))) {
          await this.completePaidOnChain(w);
        } else {
          await this.backToPending(w.id, 'Worker stopped before sending');
        }
      } catch (err) {
        this.logger.error(
          `could not rescue withdrawal ${w.id}: ${(err as Error).message}`,
        );
      }
    }
  }

  private async complete(id: string, txHash: string | null) {
    await this.dataSource.transaction(async (em) => {
      const result = await em
        .createQueryBuilder()
        .update(Withdrawal)
        .set({
          status: 'completed',
          completedAt: () => 'now()',
          ...(txHash ? { txHash } : {}),
        })
        .where('id = :id AND status IN (:...statuses)', {
          id,
          statuses: ['processing', 'sent'],
        })
        .execute();

      if (!result.affected) return;

      const withdrawal = await em.findOne(Withdrawal, { where: { id } });
      if (!withdrawal) return;

      await debitLocked(
        em,
        withdrawal.userId,
        withdrawal.asset,
        toUnits(withdrawal.amount) + toUnits(withdrawal.fee),
      );
    });

    this.logger.log(`withdrawal ${id} completed`);
  }

  private async completePaidOnChain(w: Withdrawal) {
    const hash = (await this.findPaymentTxHash(uuidToUint(w.id))) ?? w.txHash;
    await this.complete(w.id, hash);
  }

  private async failWithRefund(id: string, reason: string) {
    await this.dataSource.transaction(async (em) => {
      const result = await em
        .createQueryBuilder()
        .update(Withdrawal)
        .set({ status: 'failed', lastError: reason.slice(0, 300) })
        .where('id = :id AND status IN (:...statuses)', {
          id,
          statuses: ['processing', 'sent'],
        })
        .execute();

      if (!result.affected) return;

      const withdrawal = await em.findOne(Withdrawal, { where: { id } });
      if (!withdrawal) return;

      await unlockFunds(
        em,
        withdrawal.userId,
        withdrawal.asset,
        toUnits(withdrawal.amount) + toUnits(withdrawal.fee),
      );
    });

    this.logger.warn(`withdrawal ${id} failed and was refunded: ${reason}`);
  }

  private async retryLater(
    w: Withdrawal,
    reason: string,
    infrastructure: boolean,
  ) {
    if (!infrastructure && w.attempts >= this.maxAttempts) {
      await this.failWithRefund(w.id, reason);
      return;
    }

    const attempts = infrastructure ? Math.max(w.attempts - 1, 0) : w.attempts;
    const delayMs = Math.min(2 ** attempts * 30_000, 10 * 60_000);

    await this.repo.update(
      { id: w.id, status: 'processing' },
      {
        status: 'pending',
        attempts,
        lastError: reason.slice(0, 300),
        nextAttemptAt: new Date(Date.now() + delayMs),
      },
    );
  }

  private async backToPending(id: string, reason: string) {
    await this.repo
      .createQueryBuilder()
      .update(Withdrawal)
      .set({
        status: 'pending',
        txHash: null,
        lastError: reason,
        nextAttemptAt: () => 'now()',
      })
      .where('id = :id AND status IN (:...statuses)', {
        id,
        statuses: ['processing', 'sent'],
      })
      .execute();
  }

  private async findPaymentTxHash(idUint: bigint): Promise<string | null> {
    try {
      const factory = this.blockchain.factory;
      const latest = await this.blockchain.provider.getBlockNumber();
      const logs = await factory.queryFilter(
        factory.filters.Withdrawn(idUint),
        Math.max(latest - LOOKBACK_BLOCKS, 0),
        latest,
      );
      return logs[0]?.transactionHash ?? null;
    } catch {
      return null;
    }
  }

  private getSigner() {
    if (!this.signer) {
      const key =
        this.config.get<string>('OWNER_PRIVATE_KEY') ??
        this.config.getOrThrow<string>('OWNER_KEY');
      this.signer = new NonceManager(new Wallet(key, this.blockchain.provider));
    }
    return this.signer;
  }

  private writableFactory() {
    return this.blockchain.factory.connect(this.getSigner()) as Contract;
  }
}
