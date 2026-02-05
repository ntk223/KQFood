import { BaseEntity } from "@/base/base.entity";
import { Customer } from "@/modules/customers/entities/customer.entity";
import { Merchant } from "@/modules/merchants/entities/merchant.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { OrderStatus } from "@/constants/orderStatus";
import { PaymentMethod } from "@/constants/paymentMethod";
import type { GeoPoint } from "@/interfaces/geopoint.interface";
import { formatTime } from "@/utils/formatTime.helper";
import { Transform, Expose } from "class-transformer";
import { OrderItem } from "./order-item.entity";
import { Delivery } from "@/modules/deliveries/entities/delivery.entity";
@Entity("orders")
export class Order extends BaseEntity{
    @Column({ nullable: false, type: 'int' })
    customerId: number;
    
    @Column({ nullable: false, type: 'int' })
    merchantId: number;

    @Column({ nullable: false, type: 'enum', enum: OrderStatus.PENDING })
    status: OrderStatus;

    @Column({ nullable: false, type: 'numeric' })
    totalProductPrice: number;

    @Column({ nullable: false, type: 'numeric' })
    shippingFee: number;

    @Column({ nullable: true, type: 'numeric' })
    discountAmount: number;

    @Column({ nullable: false, type: 'numeric' })
    finalAmount: number;

    @Column({ nullable: false, type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH })
    paymentMethod: PaymentMethod;

    @Column({ nullable: true })
    deliveryAddress: string;

    @Index({ spatial: true }) // 👈 BẮT BUỘC: Tạo Index để tìm kiếm nhanh
    @Column({
        type: 'geography',
        spatialFeatureType: 'Point', 
        srid: 4326, // Chuẩn GPS quốc tế
        nullable: true,
    })
    deliveryLocation: GeoPoint;

    @Column({ nullable: true, type: 'timestamp' })
    @Transform(({ value }) => {
    if (!value) {
        return null;
    }
    return formatTime(value);
    })
    confirmedAt: Date;

    @Column({ nullable: true, type: 'timestamp' })
    @Transform(({ value }) => {
    if (!value) {
        return null;
    }
    return formatTime(value);
    })
    cancelledAt: Date

    @Column({ nullable: true, type: 'timestamp' })
    @Transform(({ value }) => {
    if (!value) {
        return null;
    }
    return formatTime(value);
    })
    completedAt: Date

    @ManyToOne(() => Customer, (customer) => customer.orders)
    @JoinColumn({ name: "customer_id" })
    customer: Customer;

    @ManyToOne(() => Merchant, (merchant) => merchant.orders)
    @JoinColumn({ name: "merchant_id" })
    merchant: Merchant;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[];

    @OneToOne(() => Delivery, (delivery) => delivery.order)
    delivery: Delivery;
}
