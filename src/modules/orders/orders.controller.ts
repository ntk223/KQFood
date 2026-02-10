import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RoleType } from '@/constants/role';
import { Roles } from '@/decorator/customize';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(RoleType.CUSTOMER)
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.sub);
  }

  @Post('/:id/confirm')
  @Roles(RoleType.MERCHANT)
  confirmOrder(@Param('id') id: string) {
    return this.ordersService.confirmOrder(+id);
  }

  @Post('/:id/cancel')
  @Roles(RoleType.CUSTOMER, RoleType.MERCHANT)
  cancelOrder(@Param('id') id: string) {
    return this.ordersService.cancelOrder(+id);
  }


}
