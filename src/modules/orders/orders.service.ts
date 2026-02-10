import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemOption } from './entities/order-item-option.entity';
import { calculateDeliveryFee } from '@/utils/caculateDeliveryFee.helper';
import { Product } from '../products/entities/product.entity';
import { Merchant } from '../merchants/entities/merchant.entity';
import { Option } from '../options/entities/option.entity';
import { GeoPoint } from '@/interfaces/geopoint.interface';
import { Customer } from '../customers/entities/customer.entity';
import { canTransitionOrderStatus, OrderStatus } from '@/constants/orderStatus';
import { DeliveryStatus, canTransitionDeliveryStatus } from '@/constants/deliveryStatus';
import { Delivery } from '../deliveries/entities/delivery.entity';
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderItemOption)
    private readonly orderItemOptionRepository: Repository<OrderItemOption>,

    private readonly dataSource: DataSource
  ) {}

  async create(dto: CreateOrderDto, userId: number) : Promise<Order> {

    return this.dataSource.transaction(async (manager) => {
      const customer = await manager.findOneBy(Customer, { userId });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
      const productIds = dto.products.map(item => item.productId);
      const allOptionIds = dto.products.flatMap(item => item.optionIds || []);

      const products = await manager.findBy(Product, { id: In(productIds) });
      const options = allOptionIds.length > 0 ? 
                      await manager.find(Option,{ 
                        where: { 
                              id: In(allOptionIds) 
                        }, 
                        relations: {
                          optionGroup: true,
                        },
                        }) : [];

      const productMap = new Map(products.map(p => [p.id, p]));
      const optionMap = new Map(options.map(o => [o.id, o]));
                      console.log(optionMap);
      const merchant = await manager.findOneBy(Merchant, { id: dto.merchantId });
      if (!merchant) {
        throw new NotFoundException('Merchant not found');
      }
      const fromLocation: GeoPoint = {
        type: 'Point',
        coordinates: [merchant.location.coordinates[0], merchant.location.coordinates[1]],
      }

      const order = new Order();
      order.customerId = customer.id;
      order.merchantId = dto.merchantId;
      order.pickupAddress = merchant.address;
      order.pickupLocation = fromLocation;
      order.paymentMethod = dto.paymentMethod;
      order.deliveryAddress = dto.deliveryAddress;
      if (dto.deliveryLat && dto.deliveryLong) {
        const deliveryLocation : GeoPoint = {
          type: 'Point',
          coordinates: [dto.deliveryLong, dto.deliveryLat],
        };
        order.deliveryLocation = deliveryLocation;
      }
      const shippingFee = calculateDeliveryFee(fromLocation, order.deliveryLocation);
      order.shippingFee = shippingFee;
      order.orderItems = [];
      let totalProductPrice = 0;

      for (const item of dto.products) {
        const product = productMap.get(item.productId);
        const orderItem = new OrderItem();
        orderItem.productId = item.productId;
        orderItem.quantity = item.quantity;
        orderItem.unitPriceSnapshot = product?.basePrice || 0;
        orderItem.productNameSnapshot = product?.name || 'Unknown Product';
        orderItem.orderItemOptions = []
        // orderItem.order = order;

        let currentItemPrice : number = product?.basePrice || 0;
        order.orderItems.push(orderItem);
        for (const optionsId of item.optionIds || []) {
          const option = optionMap.get(optionsId);
          console.log(option);
          const orderItemOption = new OrderItemOption();
          orderItemOption.groupNameSnapshot = option?.optionGroup?.name || 'Unknown Group';
          orderItemOption.optionNameSnapshot = option?.name || 'Unknown Option';
          orderItemOption.priceAdjustmentSnapshot = option?.priceAdjustment || 0;
          if (option) {
            currentItemPrice += option.priceAdjustment;
          }
          orderItem.orderItemOptions.push(orderItemOption);
        }
        orderItem.totalLinePrice = currentItemPrice * item.quantity;
        totalProductPrice += orderItem.totalLinePrice;
      }
      order.totalProductPrice = totalProductPrice;
      order.finalAmount = totalProductPrice + shippingFee;

      await manager.save(order);
      return order;

    })
  }

  async updateStatus(orderId: number, newStatus: OrderStatus, manager: EntityManager) {
    const orderRepo = manager.getRepository(Order);
    const order = await orderRepo.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (!canTransitionOrderStatus(order.status, newStatus)) {
      throw new BadRequestException(`Cannot transition from ${order.status} to ${newStatus}`);
    }
    order.status = newStatus;
    return await orderRepo.save(order);
  }

  async confirmOrder(orderId: number) {
    return this.dataSource.transaction(async (manager) => {
      const updatedOrder = await this.updateStatus(orderId, OrderStatus.CONFIRMED, manager);
      const newDelivery = new Delivery()
      newDelivery.orderId = orderId;
      newDelivery.driverFee = updatedOrder.shippingFee * 0.8; // 0.8 test
      newDelivery.pickupLocation = updatedOrder.pickupLocation
      newDelivery.dropoffLocation = updatedOrder.deliveryLocation
      updatedOrder.confirmedAt = new Date();
      await manager.save(updatedOrder);
      await manager.save(newDelivery);
      return updatedOrder;
    })
  }

  async cancelOrder(orderId: number) {
    return this.dataSource.transaction(async (manager) => {
      const updatedOrder = await this.updateStatus(orderId, OrderStatus.CANCELLED, manager);
      const deliveryRepo = manager.getRepository(Delivery);
      const delivery = await deliveryRepo.findOneBy({ orderId });
      if (!delivery) return updatedOrder;
      if (!canTransitionDeliveryStatus(delivery.status, DeliveryStatus.CANCELLED)) {
        throw new BadRequestException(`Cannot cancel delivery with status ${delivery?.status}`);
      }
      delivery.status = DeliveryStatus.CANCELLED;
      delivery.cancelledAt = new Date();
      await deliveryRepo.save(delivery);
      return updatedOrder;
    })
  }
  
  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
