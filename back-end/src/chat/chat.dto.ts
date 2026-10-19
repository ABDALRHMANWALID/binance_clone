import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MAX_ATTACHMENTS_PER_MESSAGE } from './chat.constants.js';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const BIGINT_ID = /^\d{1,19}$/;

export class SendMessageDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(2000)
  content?: string;

  @IsOptional()
  @IsUUID()
  clientMessageId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_ATTACHMENTS_PER_MESSAGE)
  @IsUUID(undefined, { each: true })
  attachmentIds?: string[];
}

export class MarkReadDto {
  @Matches(BIGINT_ID, { message: 'lastReadMessageId must be a message id' })
  lastReadMessageId: string;
}

export class ListMessagesQueryDto {
  @IsOptional()
  @Matches(BIGINT_ID, { message: 'before must be a message id' })
  before?: string;

  @IsOptional()
  @Matches(BIGINT_ID, { message: 'after must be a message id' })
  after?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class ListConversationsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}

export class JoinConversationDto {
  @IsUUID()
  conversationId: string;
}

export class WsSendMessageDto extends SendMessageDto {
  @IsUUID()
  conversationId: string;
}

export class WsMarkReadDto extends MarkReadDto {
  @IsUUID()
  conversationId: string;
}
