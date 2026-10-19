import { Module } from '@nestjs/common';
import { WithdrawalsController } from './withdrawals.controller.js';
import { WithdrawalsService } from './withdrawals.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { BlockchainModule } from '../blockchain/blockchain.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Withdrawal } from './withdrawal.entity.js';
import { Balance } from '../deposit/entities/balances.js';
import { WithdrawalsProcessor } from './withdrawals.processor.js';

@Module({
  imports: [
    AuthModule,
    BlockchainModule,
    TypeOrmModule.forFeature([Withdrawal, Balance]),
  ],
  controllers: [WithdrawalsController],
  providers: [WithdrawalsService, WithdrawalsProcessor],
})
export class WithdrawalsModule {}
