import { BaseEntity } from "@/base/base.entity";
import { MerchantCategory } from "@/modules/merchant-categories/entities/merchant-category.entity";
import { Merchant } from "@/modules/merchants/entities/merchant.entity";
import { OptionGroup } from "@/modules/option-groups/entities/option-group.entity";
import { OrderItem } from "@/modules/orders/entities/order-item.entity";
import { SystemCategory } from "@/modules/system-categories/entities/system-category.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity("products")
export class Product extends BaseEntity {
    @Column({ nullable: false, type: 'int' })
    merchantId: number;

    @Column({ nullable: false, type: 'int' })
    categoryId: number;

    @Column({ nullable: false, type: 'varchar' })
    name: string;

    @Column({ nullable: true, type: 'text' })
    description: string;

    @Column({ nullable: false, type: 'numeric' })
    basePrice: number;

    @Column({ nullable: true, type: 'varchar' })
    imageUrl: string;

    @Column({ nullable: false, type: 'boolean' })
    isActive: boolean;

    @ManyToMany(() => SystemCategory, (category) => category.products, {
        cascade: true, // Cho phép thêm mới category ngay lúc tạo product (nếu muốn)
    })
    @JoinTable({
        // 1. Tên bảng trung gian trong SQL của bạn
        name: 'product_system_tags', 
        
        // 2. Khóa ngoại trỏ về bảng hiện tại (Product)
        joinColumn: {
        name: 'product_id', 
        referencedColumnName: 'id',
        },

        // 3. Khóa ngoại trỏ về bảng kia (SystemCategory)
        inverseJoinColumn: {
        name: 'system_category_id',
        referencedColumnName: 'id',
        },
    })
    systemCategories: SystemCategory[];

    @ManyToMany(() => OptionGroup, (optionGroup) => optionGroup.products, {
        cascade: true,
    })
    @JoinTable({
        name: 'product_option_groups',
        joinColumn: {
            name: 'product_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'group_id',
            referencedColumnName: 'id',
        },
    })
    optionGroups: OptionGroup[];

    @ManyToOne(() => Merchant, (merchant) => merchant.products)
    @JoinColumn({ name: "merchant_id" })
    merchant: Merchant;

    @ManyToOne(() => MerchantCategory, (merchantCategories) => merchantCategories.products)
    @JoinColumn({ name: "category_id" })
    merchantCategory: MerchantCategory;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];
}
