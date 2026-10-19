import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type WithdrawalStatus =
  'pending' | 'processing' | 'sent' | 'completed' | 'failed';

@Entity('withdrawals')
@Index(['status', 'nextAttemptAt'])
@Index(['userId', 'createdAt'])
@Index(['userId', 'clientRequestId'], {
  unique: true,
  where: '"client_request_id" IS NOT NULL',
})
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'text' })
  asset: string;

  @Column({ name: 'chain_id', type: 'int' })
  chainId: number;

  @Column({ name: 'to_address', type: 'text' })
  toAddress: string;

  @Column({ type: 'numeric', precision: 38, scale: 18 })
  amount: string;

  @Column({ type: 'numeric', precision: 38, scale: 18, default: 0 })
  fee: string;

  @Column({ type: 'text', default: 'pending' })
  status: WithdrawalStatus;

  @Column({ name: 'tx_hash', type: 'text', nullable: true })
  txHash: string | null;

  @Column({ name: 'last_error', type: 'text', nullable: true })
  lastError: string | null;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({
    name: 'next_attempt_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  nextAttemptAt: Date;

  @Column({ name: 'client_request_id', type: 'uuid', nullable: true })
  clientRequestId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })
  sentAt: Date | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
