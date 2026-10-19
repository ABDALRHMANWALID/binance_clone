import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { ZeroAddress, getAddress, isAddress } from 'ethers';
import { BlockchainService } from '../blockchain/blockchain.service.js';
import {
  clean,
  fromUnits,
  lockFunds,
  toUnits,
} from '../balances/balance-ops.js';
import { CreateWithdrawalDto } from './withdrawals.dto.js';
import { Withdrawal } from './withdrawal.entity.js';

const OPEN_STATUSES = ['pending', 'processing', 'sent'];

@Injectable()
export class WithdrawalsService {
  private readonly chainId: number;
  private readonly minWei: bigint;
  private readonly maxWei: bigint;
  private readonly dailyLimitWei: bigint;
  private readonly feeWei: bigint;
  private readonly maxOpen: number;

  constructor(
    config: ConfigService,
    private readonly dataSource: DataSource,
    private readonly blockchain: BlockchainService,
    @InjectRepository(Withdrawal)
    private readonly repo: Repository<Withdrawal>,
  ) {
    this.chainId = Number(
      config.get('CHAIN_ID') ?? config.getOrThrow('SEPOLIA_CHAIN_ID'),
    );
    this.minWei = toUnits(
      config.get<string>('WITHDRAW_MIN_ETH') ?? '0.000000001',
    );
    this.maxWei = toUnits(config.get<string>('WITHDRAW_MAX_ETH') ?? '1');
    this.dailyLimitWei = toUnits(
      config.get<string>('WITHDRAW_DAILY_LIMIT_ETH') ?? '2',
    );
    this.feeWei = toUnits(config.get<string>('WITHDRAW_FEE_ETH') ?? '0');
    this.maxOpen = Number(config.get('WITHDRAW_MAX_OPEN') ?? 3);
  }

  async create(userId: string, dto: CreateWithdrawalDto) {
    const asset = dto.asset ?? 'ETH';
    const amount = toUnits(dto.amount);

    if (amount < this.minWei) {
      throw new BadRequestException(
        `Minimum withdrawal is ${fromUnits(this.minWei)} ${asset}`,
      );
    }
    if (amount > this.maxWei) {
      throw new BadRequestException(
        `Maximum per withdrawal is ${fromUnits(this.maxWei)} ${asset}`,
      );
    }

    const toAddress = await this.parseAddress(dto.address);

    return this.dataSource.transaction(async (em) => {
      await em.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `withdraw:${userId}`,
      ]);

      if (dto.clientRequestId) {
        const existing = await em.findOne(Withdrawal, {
          where: { userId, clientRequestId: dto.clientRequestId },
        });
        if (existing) return this.toView(existing);
      }

      const open = await em.count(Withdrawal, {
        where: { userId, status: In(OPEN_STATUSES) },
      });
      if (open >= this.maxOpen) {
        throw new BadRequestException(
          'You have too many withdrawals in progress, wait until they finish',
        );
      }

      const used = await this.usedLast24h(em, userId, asset);
      if (used + amount > this.dailyLimitWei) {
        throw new BadRequestException(
          `Daily limit is ${fromUnits(this.dailyLimitWei)} ${asset}. ` +
            `Remaining today: ${fromUnits(this.dailyLimitWei > used ? this.dailyLimitWei - used : BigInt(0))}`,
        );
      }

      await lockFunds(em, userId, asset, amount + this.feeWei);

      const withdrawal = await em.save(
        em.create(Withdrawal, {
          userId,
          asset,
          chainId: this.chainId,
          toAddress,
          amount: fromUnits(amount),
          fee: fromUnits(this.feeWei),
          status: 'pending',
          clientRequestId: dto.clientRequestId ?? null,
        }),
      );

      return this.toView(withdrawal);
    });
  }

  async list(userId: string, limit = 50) {
    const rows = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 100),
    });
    return { items: rows.map((w) => this.toView(w)) };
  }

  async getOne(userId: string, id: string) {
    const withdrawal = await this.repo.findOne({ where: { id, userId } });
    if (!withdrawal) throw new NotFoundException('Withdrawal not found');
    return this.toView(withdrawal);
  }

  async getLimits(userId: string, asset = 'ETH') {
    const used = await this.usedLast24h(this.dataSource.manager, userId, asset);
    const remaining =
      this.dailyLimitWei > used ? this.dailyLimitWei - used : BigInt(0);

    return {
      asset,
      chainId: this.chainId,
      min: fromUnits(this.minWei),
      max: fromUnits(this.maxWei),
      fee: fromUnits(this.feeWei),
      dailyLimit: fromUnits(this.dailyLimitWei),
      usedLast24h: fromUnits(used),
      remainingToday: fromUnits(remaining),
    };
  }

  private async parseAddress(raw: string) {
    if (!isAddress(raw)) throw new BadRequestException('Invalid address');

    const address = getAddress(raw);
    if (address === ZeroAddress) {
      throw new BadRequestException('Invalid address');
    }

    const factoryAddress = await this.blockchain.factory.getAddress();
    if (address === getAddress(factoryAddress)) {
      throw new BadRequestException(
        'You cannot withdraw to the platform address',
      );
    }
    return address;
  }

  private async usedLast24h(em: EntityManager, userId: string, asset: string) {
    const rows: { total: string }[] = await em.query(
      `SELECT COALESCE(SUM(amount), 0)::text AS total
       FROM withdrawals
       WHERE user_id = $1 AND asset = $2 AND status <> 'failed'
         AND created_at > now() - interval '24 hours'`,
      [userId, asset],
    );
    return toUnits(rows[0]?.total ?? '0');
  }

  private toView(w: Withdrawal) {
    return {
      id: w.id,
      asset: w.asset,
      chainId: w.chainId,
      address: w.toAddress,
      amount: clean(w.amount),
      fee: clean(w.fee),
      status: w.status,
      txHash: w.txHash,
      createdAt: w.createdAt,
      completedAt: w.completedAt,
    };
  }
}
