import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

const ASSET_DECIMAL = /^\d+(\.\d{1,18})?$/;
const toStr = ({ value }: { value: unknown }) =>
  typeof value === 'number' ? String(value) : value;

export class CreateOrderDto {
  @Transform(toStr)
  @Matches(ASSET_DECIMAL, {
    message: 'amount must be a positive number with up to 18 decimals',
  })
  amount: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  paymentMethodId: number;
}

export class PayOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(3)
  @IsUUID(undefined, { each: true })
  uploadIds: string[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @IsOptional()
  @IsUUID()
  clientMessageId?: string;
}

export class ListOrdersQueryDto {
  @IsOptional()
  @IsIn(['pending_payment', 'paid', 'completed', 'cancelled'])
  status?: 'pending_payment' | 'paid' | 'completed' | 'cancelled';
}
