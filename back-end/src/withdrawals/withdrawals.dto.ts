import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsUUID, Matches } from 'class-validator';

export const SUPPORTED_ASSETS = ['ETH'];

const ASSET_DECIMAL = /^\d+(\.\d{1,18})?$/;
const toStr = ({ value }: { value: unknown }) =>
  typeof value === 'number' ? String(value) : value;

export class CreateWithdrawalDto {
  @IsOptional()
  @IsIn(SUPPORTED_ASSETS)
  asset?: string;

  @Matches(/^0x[0-9a-fA-F]{40}$/, {
    message: 'address must be a valid 0x address',
  })
  address: string;

  @Transform(toStr)
  @Matches(ASSET_DECIMAL, {
    message: 'amount must be a positive number with up to 18 decimals',
  })
  amount: string;

  @IsOptional()
  @IsUUID()
  clientRequestId?: string;
}

export class LimitsQueryDto {
  @IsOptional()
  @IsIn(SUPPORTED_ASSETS)
  asset?: string;
}
