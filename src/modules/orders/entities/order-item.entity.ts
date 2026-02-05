import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "@/modules/products/entities/product.entity";
import { OrderItemOption } from "./order-item-option.entity";

@Entity("order_items")
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'int' })
    orderId: number;

    @Column({ nullable: false, type: 'int' })
    productId: number;
    
    @Column({ nullable: false, type: 'varchar' })
    productNameSnapshot: string;

    @Column({ nullable: false, type: 'numeric' })
    unitPriceSnapshot: number;

    @Column({ nullable: false, type: 'int' })
    quantity: number;
    // @Expose()

    @Column({ nullable: false, type: 'numeric' })
    totalLinePrice: number;

    @OneToMany(() => Order, (order) => order.orderItems)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Product, (product) => product.orderItems)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @OneToMany(() => OrderItemOption, (orderItemOption) => orderItemOption.orderItem)
    orderItemOptions: OrderItemOption[];
}