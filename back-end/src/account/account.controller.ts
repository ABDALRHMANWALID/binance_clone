import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-guard/jwt-guard.guard.js';
import { CurrentUser } from '../auth/current-user/current-user.decorator.js';
import { AccountTransactionsQueryDto } from './account.dto.js';
import { AccountService } from './account.service.js';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly account: AccountService) {}

  @Get()
  getAccount(@CurrentUser() user: { id: string }) {
    return this.account.getAccount(user.id);
  }

  @Get('transactions')
  getTransactions(
    @CurrentUser() user: { id: string },
    @Query() q: AccountTransactionsQueryDto,
  ) {
    return this.account.getTransactions(user.id, q);
  }
}
