import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeliveryStatus } from '@/constants/deliveryStatus';
import { RoleType } from '@/constants/role';
import { Roles } from '@/decorator/customize';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post('/:id/arrive')
  @Roles(RoleType.DRIVER)
  arriveMerchant(@Param('id') id: string) {
    return this.deliveriesService.updateDeliveryStatus(+id, DeliveryStatus.ARRIVED_MERCHANT);
  }

  @Post('/:id/pickup')
  @Roles(RoleType.DRIVER)
  pickup(@Param('id') id: string) {
    return this.deliveriesService.updateDeliveryStatus(+id, DeliveryStatus.PICKED_UP);
  }

  @Post('/:id/delivering')
  @Roles(RoleType.DRIVER)
  deliver(@Param('id') id: string) {
    return this.deliveriesService.updateDeliveryStatus(+id, DeliveryStatus.DELIVERING);
  }

  @Post('/:id/assign-driver')
  @Roles(RoleType.ADMIN, RoleType.DRIVER)
  assignDriver(@Param('id') id: string, @Request() req) {
    return this.deliveriesService.assignDriver(+id, req.user.sub);
  }

  @Post('/:id/complete')
  @Roles(RoleType.DRIVER)
  complete(@Param('id') id: string) {
    return this.deliveriesService.completeDelivery(+id);
  }
}
