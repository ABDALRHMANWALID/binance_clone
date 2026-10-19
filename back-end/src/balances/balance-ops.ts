import { BadRequestException, ConflictException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { formatUnits, parseUnits } from 'viem';
import { Balance } from '../deposit/entities/balances.js';

export const DECIMALS = 18;
export const ONE = BigInt(10) ** BigInt(DECIMALS);

export const toUnits = (v: string) => parseUnits(v, DECIMALS);
export const fromUnits = (v: bigint) => formatUnits(v, DECIMALS);
export const clean = (v: string) => fromUnits(toUnits(v));

export async function lockFunds(
  em: EntityManager,
  userId: string,
  asset: string,
  amount: bigint,
) {
  const result = await em
    .createQueryBuilder()
    .update(Balance)
    .set({
      available: () => 'available - CAST(:amount AS numeric)',
      locked: () => 'locked + CAST(:amount AS numeric)',
    })
    .where(
      'user_id = :userId AND asset = :asset AND available >= CAST(:amount AS numeric)',
      { userId, asset, amount: fromUnits(amount) },
    )
    .execute();

  if (!result.affected) {
    const balance = await em.findOne(Balance, {
      where: { user_id: userId, asset },
    });
    const available = balance ? clean(balance.available) : '0';
    throw new BadRequestException(
      `Insufficient ${asset} balance. Available: ${available}`,
    );
  }
}

export async function unlockFunds(
  em: EntityManager,
  userId: string,
  asset: string,
  amount: bigint,
) {
  const result = await em
    .createQueryBuilder()
    .update(Balance)
    .set({
      locked: () => 'locked - CAST(:amount AS numeric)',
      available: () => 'available + CAST(:amount AS numeric)',
    })
    .where(
      'user_id = :userId AND asset = :asset AND locked >= CAST(:amount AS numeric)',
      { userId, asset, amount: fromUnits(amount) },
    )
    .execute();

  if (!result.affected) {
    throw new ConflictException(
      'Locked balance does not match this trade, please contact support',
    );
  }
}

export async function settleTrade(
  em: EntityManager,
  sellerId: string,
  buyerId: string,
  asset: string,
  amount: bigint,
) {
  const debit = await em
    .createQueryBuilder()
    .update(Balance)
    .set({ locked: () => 'locked - CAST(:amount AS numeric)' })
    .where(
      'user_id = :userId AND asset = :asset AND locked >= CAST(:amount AS numeric)',
      { userId: sellerId, asset, amount: fromUnits(amount) },
    )
    .execute();

  if (!debit.affected) {
    throw new ConflictException(
      'Seller locked balance does not match this trade, please contact support',
    );
  }

  await em.query(
    `INSERT INTO balances (user_id, asset, available, locked)
     VALUES ($1, $2, $3, 0)
     ON CONFLICT (user_id, asset)
     DO UPDATE SET available = balances.available + EXCLUDED.available`,
    [buyerId, asset, fromUnits(amount)],
  );
}

export async function debitLocked(
  em: EntityManager,
  userId: string,
  asset: string,
  amount: bigint,
) {
  const result = await em
    .createQueryBuilder()
    .update(Balance)
    .set({ locked: () => 'locked - CAST(:amount AS numeric)' })
    .where(
      'user_id = :userId AND asset = :asset AND locked >= CAST(:amount AS numeric)',
      { userId, asset, amount: fromUnits(amount) },
    )
    .execute();

  if (!result.affected) {
    throw new ConflictException(
      'Locked balance does not match this withdrawal, please contact support',
    );
  }
}
