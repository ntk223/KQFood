import { BaseEntity } from "@/base/base.entity";
import { User } from "@/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import type { SavedLocation } from "@/interfaces/location.interface";
import { Order } from "@/modules/orders/entities/order.entity";
@Entity("customer_profiles")
export class Customer extends BaseEntity {
    @Column({ nullable: false, unique: true, type: 'int' })
    userId: number;

    @Column({ nullable: true, type: 'jsonb' })
    savedLocations: SavedLocation[];

    @OneToOne(() => User, (user) => user.customer)
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];

}
