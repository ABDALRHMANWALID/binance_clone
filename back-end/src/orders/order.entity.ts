import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ad } from '../ads/ads.entity.js';
import type { Relation } from 'typeorm';

export type OrderStatus =
  'pending_payment' | 'paid' | 'completed' | 'cancelled';

@Entity('orders')
@Index(['buyerId'])
@Index(['sellerId'])
@Index(['status', 'expiresAt'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ad_id', type: 'int' })
  adId: number;

  @ManyToOne(() => Ad, { nullable: false })
  @JoinColumn({ name: 'ad_id' })
  ad: Relation<Ad>;

  @Column({ name: 'buyer_id', type: 'uuid' })
  buyerId: string;

  @Column({ name: 'seller_id', type: 'uuid' })
  sellerId: string;

  @Column({ name: 'payment_method_id', type: 'int' })
  paymentMethodId: number;

  @Column({ type: 'text' })
  asset: string;

  @Column({ type: 'text' })
  fiat: string;

  @Column({ type: 'numeric', precision: 38, scale: 18 })
  amount: string;

  @Column({ type: 'numeric', precision: 20, scale: 6 })
  price: string;

  @Column({ name: 'fiat_amount', type: 'numeric', precision: 20, scale: 2 })
  fiatAmount: string;

  @Column({ type: 'text', default: 'pending_payment' })
  status: OrderStatus;

  @Column({ name: 'payment_proof_message_id', type: 'bigint', nullable: true })
  paymentProofMessageId: string | null;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt: Date | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
