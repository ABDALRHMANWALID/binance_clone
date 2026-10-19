import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-guard/jwt-guard.guard.js';
import { CurrentUser } from '../auth/current-user/current-user.decorator.js';
import {
  CreateOrderDto,
  ListOrdersQueryDto,
  PayOrderDto,
} from './orders.dto.js';
import { OrdersService } from './orders.service.js';

@Controller()
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post('ads/:adId/orders')
  create(
    @CurrentUser() user: { id: string },
    @Param('adId', ParseIntPipe) adId: number,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orders.createFromAd(user.id, adId, dto);
  }

  @Get('orders')
  list(@CurrentUser() user: { id: string }, @Query() q: ListOrdersQueryDto) {
    return this.orders.listMyOrders(user.id, q.status);
  }

  @Get('orders/:id')
  getOne(
    @CurrentUser() user: { id: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.orders.getOrder(user.id, id);
  }

  @Post('orders/:id/pay')
  pay(
    @CurrentUser() user: { id: string },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PayOrderDto,
  ) {
    return this.orders.markPaid(user.id, id, dto);
  }

  @Post('orders/:id/confirm')
  confirm(
    @CurrentUser() user: { id: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.orders.confirm(user.id, id);
  }

  @Post('orders/:id/cancel')
  cancel(
    @CurrentUser() user: { id: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.orders.cancel(user.id, id);
  }
}
