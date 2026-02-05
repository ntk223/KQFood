import { BaseEntity } from "@/base/base.entity";
import { Driver } from "@/modules/drivers/entities/driver.entity";
import { Order } from "@/modules/orders/entities/order.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import type { GeoPoint } from "@/interfaces/geopoint.interface";
import { DeliveryStatus } from "@/constants/deliveryStatus";
import { Transform } from "class-transformer";
import { formatTime } from "@/utils/formatTime.helper";
@Entity("deliveries")
export class Delivery extends BaseEntity{
    @Column({ nullable: false, type: 'int' })
    orderId: number;
    
    @Column({ nullable: true, type: 'int' })
    driverId: number;

    @Column({type:'enum', enum: DeliveryStatus, nullable: false, default:DeliveryStatus.SEARCHING})
    status: DeliveryStatus;

    @Column({ nullable: false, type: 'numeric' })
    driverFee: number;

    @Column({
        type: 'geography',
        spatialFeatureType: 'Point', 
        srid: 4326, // Chuẩn GPS quốc tế
        nullable: true,
    })
    dropOffLocation: GeoPoint;

    @Column({
        type: 'geography',
        spatialFeatureType: 'Point', 
        srid: 4326, // Chuẩn GPS quốc tế
        nullable: true,
    })
    pickUpLocation: GeoPoint;

    @Column({ nullable: true, type: 'timestamp' })
    @Transform(({ value }) => {
        if (!value) {
            return null;
        }
        return formatTime(value);
        })
    assignedAt: Date;

    @Column({ nullable: true, type: 'timestamp' })
    @Transform(({ value }) => {
        if (!value) {
            return null;
        }
        return formatTime(value);
        })
    pickedUpAt: Date

    @Column({ nullable: true, type: 'timestamp' })
    @Transform(({ value }) => {
        if (!value) {
            return null;
        }
        return formatTime(value);
        })
    deliveredAt: Date

    @Column({ nullable: true, type: 'timestamp' })
    @Transform(({ value }) => {
        if (!value) {
            return null;
        }
        return formatTime(value);
        })
    canceledAt: Date

    @OneToOne(() => Order, (order) => order.delivery)
    @JoinColumn({ name: "order_id" })
    order: Order;

    @ManyToOne(() => Driver, (driver) => driver.deliveries)
    @JoinColumn({ name: "driver_id" })
    driver: Driver;
}
