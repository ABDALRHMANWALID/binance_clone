import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-guard/jwt-guard.guard.js';
import { CurrentUser } from '../auth/current-user/current-user.decorator.js';
import { CreateWithdrawalDto, LimitsQueryDto } from './withdrawals.dto.js';
import { WithdrawalsService } from './withdrawals.service.js';

@Controller('withdrawals')
@UseGuards(JwtAuthGuard)
export class WithdrawalsController {
  constructor(private readonly withdrawals: WithdrawalsService) {}

  @Get('limits')
  limits(@CurrentUser() user: { id: string }, @Query() q: LimitsQueryDto) {
    return this.withdrawals.getLimits(user.id, q.asset);
  }

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateWithdrawalDto,
  ) {
    return this.withdrawals.create(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.withdrawals.list(user.id);
  }

  @Get(':id')
  getOne(
    @CurrentUser() user: { id: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.withdrawals.getOne(user.id, id);
  }
}
