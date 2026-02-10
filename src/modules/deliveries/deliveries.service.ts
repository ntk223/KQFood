import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';
import { DataSource, Repository } from 'typeorm';
import { Driver } from '../drivers/entities/driver.entity';
import { Order } from '../orders/entities/order.entity';
import { canTransitionDeliveryStatus, DeliveryStatus } from '@/constants/deliveryStatus';
import { OrderStatus } from '@/constants/orderStatus';
@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private deliveriesRepository: Repository<Delivery>,

    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>,

    private readonly dataSource: DataSource
  ) {}

  // use for status: [DELIVERING, ARRIVED_MERCHANT, PICKED_UP]
  async updateDeliveryStatus(deliveryId : number, status: DeliveryStatus) : Promise<Delivery> {
    const delivery = await this.deliveriesRepository.findOneBy({ id: deliveryId });
    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }
    if (!canTransitionDeliveryStatus(delivery.status, status)) {
      throw new BadRequestException(`Cannot transition delivery status from ${delivery.status} to ${status}`);
    }
    delivery.status = status;
    switch (status) {
      case DeliveryStatus.PICKED_UP:
        delivery.pickedUpAt = new Date();
        break;
    }
    return await this.deliveriesRepository.save(delivery);
  }
  
  async assignDriver(deliveryId: number, userId: number) : Promise<Delivery> {
    const driver = await this.driversRepository.findOneBy({ userId });
    if (!driver) {
      throw new NotFoundException('Driver not found');
    } 
    const delivery = await this.deliveriesRepository.findOneBy({ id: deliveryId });
    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }
    if (!canTransitionDeliveryStatus(delivery.status, DeliveryStatus.ASSIGNED)) {
      throw new BadRequestException(`Cannot assign driver to delivery with status ${delivery.status}`);
    }
    delivery.driverId = driver.id;
    delivery.status = DeliveryStatus.ASSIGNED;
    delivery.assignedAt = new Date();
    return await this.deliveriesRepository.save(delivery);
  }

  async completeDelivery(deliveryId: number) {
    return this.dataSource.transaction(async (manager) => {
      const delivery = await manager.findOneBy(Delivery, { id: deliveryId });
      if (!delivery) {
        throw new NotFoundException('Delivery not found');
      }
      if (!canTransitionDeliveryStatus(delivery.status, DeliveryStatus.DELIVERED)) {
        throw new BadRequestException(`Cannot complete delivery with status ${delivery.status}`);
      }
      const order = await manager.findOneBy(Order, { id: delivery.orderId });
      if (!order) {
        throw new NotFoundException('Associated order not found');
      }
      delivery.status = DeliveryStatus.DELIVERED;
      delivery.deliveredAt = new Date();
      order.completedAt = new Date();
      order.status = OrderStatus.COMPLETED;
      await manager.save(order);
      return await manager.save(delivery);
    })
  }

}
