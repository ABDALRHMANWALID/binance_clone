import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, LessThan } from 'typeorm';
import { User } from '../auth/user.entity.js';
import { Balance } from '../deposit/entities/balances.js';
import { Order } from '../orders/order.entity.js';
import { Withdrawal } from '../withdrawals/withdrawal.entity.js';
import { clean, fromUnits, toUnits } from '../balances/balance-ops.js';
import { AccountTransactionsQueryDto } from './account.dto.js';

export type TransactionType = 'deposit' | 'withdrawal' | 'buy' | 'sell';

export interface AccountTransaction {
  id: string;
  type: TransactionType;
  asset: string;
  amount: string;
  fiatAmount: string | null;
  fiat: string | null;
  status: string;
  txHash: string | null;
  chainId: number | null;
  orderId: string | null;
  createdAt: string;
}

const text = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value : null;

const toIso = (value: unknown) => {
  if (!value) return null;
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const depositToEth = (amount: string) =>
  amount.includes('.') ? clean(amount) : fromUnits(BigInt(amount));

@Injectable()
export class AccountService {
  private readonly depositChainId: number | null;

  constructor(
    config: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.depositChainId =
      Number(config.get('CHAIN_ID') ?? config.get('SEPOLIA_CHAIN_ID')) || null;
  }

  async getAccount(userId: string) {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const extra = user as unknown as Record<string, unknown>;

    const rows = await this.dataSource.getRepository(Balance).find({
      where: { user_id: userId },
      order: { asset: 'ASC' },
    });

    const balances = rows.map((b) => ({
      asset: b.asset,
      available: clean(b.available),
      locked: clean(b.locked),
      total: fromUnits(toUnits(b.available) + toUnits(b.locked)),
    }));

    if (!balances.some((b) => b.asset === 'ETH')) {
      balances.unshift({
        asset: 'ETH',
        available: '0',
        locked: '0',
        total: '0',
      });
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: text(extra.name),
        createdAt: toIso(extra.createdAt ?? extra.created_at),
      },
      balances,
    };
  }

  async getTransactions(userId: string, q: AccountTransactionsQueryDto) {
    const limit = q.limit ?? 20;
    const before = q.before ? new Date(q.before) : null;
    const want = (kind: string) =>
      !q.type || q.type === 'all' || q.type === kind;

    const [deposits, withdrawals, trades] = await Promise.all([
      want('deposit') ? this.deposits(userId, before, limit + 1) : [],
      want('withdrawal') ? this.withdrawals(userId, before, limit + 1) : [],
      want('trade') ? this.trades(userId, before, limit + 1) : [],
    ]);

    const merged = [...deposits, ...withdrawals, ...trades]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit + 1);

    const hasMore = merged.length > limit;
    const items = merged.slice(0, limit);

    return {
      items,
      nextCursor: hasMore ? items[items.length - 1].createdAt : null,
    };
  }

  private async deposits(
    userId: string,
    before: Date | null,
    take: number,
  ): Promise<AccountTransaction[]> {
    const rows: {
      id: string;
      asset: string;
      amount: string;
      txHash: string | null;
      createdAt: Date;
    }[] = await this.dataSource.query(
      `SELECT d.id::text AS id, d.asset, d.amount::text AS amount,
              d.tx_hash AS "txHash", d."createdAt" AS "createdAt"
       FROM deposits d
       WHERE d.user_id = $1
         AND ($2::timestamptz IS NULL OR d."createdAt" < $2::timestamptz)
       ORDER BY d."createdAt" DESC
       LIMIT $3`,
      [userId, before, take],
    );

    return rows.map((r) => ({
      id: `deposit:${r.id}`,
      type: 'deposit' as const,
      asset: r.asset,
      amount: depositToEth(r.amount),
      fiatAmount: null,
      fiat: null,
      status: 'completed',
      txHash: r.txHash,
      chainId: this.depositChainId,
      orderId: null,
      createdAt: new Date(r.createdAt).toISOString(),
    }));
  }

  private async withdrawals(
    userId: string,
    before: Date | null,
    take: number,
  ): Promise<AccountTransaction[]> {
    const rows = await this.dataSource.getRepository(Withdrawal).find({
      where: before ? { userId, createdAt: LessThan(before) } : { userId },
      order: { createdAt: 'DESC' },
      take,
    });

    return rows.map((w) => ({
      id: `withdrawal:${w.id}`,
      type: 'withdrawal' as const,
      asset: w.asset,
      amount: clean(w.amount),
      fiatAmount: null,
      fiat: null,
      status: w.status,
      txHash: w.txHash,
      chainId: w.chainId,
      orderId: null,
      createdAt: w.createdAt.toISOString(),
    }));
  }

  private async trades(
    userId: string,
    before: Date | null,
    take: number,
  ): Promise<AccountTransaction[]> {
    const qb = this.dataSource
      .getRepository(Order)
      .createQueryBuilder('o')
      .where('(o.buyerId = :userId OR o.sellerId = :userId)', { userId });

    if (before) qb.andWhere('o.createdAt < :before', { before });

    const orders = await qb.orderBy('o.createdAt', 'DESC').take(take).getMany();

    return orders.map((o) => ({
      id: `order:${o.id}`,
      type: o.buyerId === userId ? ('buy' as const) : ('sell' as const),
      asset: o.asset,
      amount: clean(o.amount),
      fiatAmount: o.fiatAmount,
      fiat: o.fiat,
      status: o.status,
      txHash: null,
      chainId: null,
      orderId: o.id,
      createdAt: o.createdAt.toISOString(),
    }));
  }
}
