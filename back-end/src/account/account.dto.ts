import { Type } from 'class-transformer';
import { IsIn, IsInt, IsISO8601, IsOptional, Max, Min } from 'class-validator';

export class AccountTransactionsQueryDto {
  @IsOptional()
  @IsIn(['all', 'deposit', 'withdrawal', 'trade'])
  type?: 'all' | 'deposit' | 'withdrawal' | 'trade';

  @IsOptional()
  @IsISO8601()
  before?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
