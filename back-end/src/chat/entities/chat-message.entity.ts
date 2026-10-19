import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ChatConversation } from './chat-conversation.entity.js';
import { ChatMessageAttachment } from './chat-message-attachment.entity.js';
import type { Relation } from 'typeorm';

export type MessageType = 'text' | 'image' | 'file';

@Entity('chat_messages')
@Index(['conversationId', 'id'])
@Unique(['senderId', 'clientMessageId'])
export class ChatMessage {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'conversation_id', type: 'uuid' })
  conversationId: string;

  @ManyToOne(() => ChatConversation, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Relation<ChatConversation>;

  @Column({ name: 'sender_id', type: 'uuid' })
  senderId: string;

  @Column({ name: 'client_message_id', type: 'text', nullable: true })
  clientMessageId: string | null;

  @Column({ type: 'text' })
  type: MessageType;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'edited_at', type: 'timestamptz', nullable: true })
  editedAt: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date | null;

  @OneToMany(() => ChatMessageAttachment, (attachment) => attachment.message)
  attachments: ChatMessageAttachment[];
}
