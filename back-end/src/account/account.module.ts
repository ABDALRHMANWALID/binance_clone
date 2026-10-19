import { Module } from '@nestjs/common';
import { AccountService } from './account.service.js';
import { AccountController } from './account.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { User } from '../auth/user.entity.js';
import { Balance } from '../deposit/entities/balances.js';
import { Withdrawal } from '../withdrawals/withdrawal.entity.js';
import { Order } from '../orders/order.entity.js';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User, Balance, Withdrawal, Order]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
