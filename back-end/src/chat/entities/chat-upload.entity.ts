import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type UploadStatus = 'uploaded' | 'attached' | 'rejected';

@Entity('chat_uploads')
@Index(['status', 'expiresAt'])
export class ChatUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'uploaded_by', type: 'uuid' })
  uploadedBy: string;

  @Column({ name: 'conversation_id', type: 'uuid' })
  conversationId: string;

  @Column({ name: 'storage_key', type: 'text' })
  storageKey: string;

  @Column({ name: 'original_filename', type: 'text' })
  originalFilename: string;

  @Column({ name: 'mime_type', type: 'text' })
  mimeType: string;

  @Column({ name: 'size_bytes', type: 'int' })
  sizeBytes: number;

  @Column({ type: 'text', nullable: true })
  checksum: string | null;

  @Column({ type: 'text', default: 'uploaded' })
  status: UploadStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;
}
