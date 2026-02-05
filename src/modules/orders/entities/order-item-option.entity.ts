import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity("order_item_options")
export class OrderItemOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'int' })
    orderItemId: number;

    @Column({ nullable: false, type: 'varchar' })
    groupNameSnapshot: string;

    @Column({ nullable: false, type: 'varchar' })
    optionNameSnapshot: string;

    @Column({ nullable: false, type: 'numeric' })
    priceAdjustmentSnapshot: number;
    
    @ManyToOne(() => OrderItem, (orderItem) => orderItem.orderItemOptions)
    @JoinColumn({ name: "order_item_id" })
    orderItem: OrderItem;
    
}