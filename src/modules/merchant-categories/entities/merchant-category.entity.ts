import { BaseEntity } from "@/base/base.entity";
import { Merchant } from "@/modules/merchants/entities/merchant.entity";
import { Product } from "@/modules/products/entities/product.entity";
import { JoinColumn, ManyToOne, Column, Entity, OneToMany } from "typeorm";

@Entity("merchant_categories")
export class MerchantCategory extends BaseEntity{
    @Column({ nullable: false })
    merchantId: number;

    @Column({ nullable: false, type: 'varchar' })
    name: string;

    @ManyToOne( () => Merchant, (merchant) => merchant.categories)
    @JoinColumn({ name: "merchant_id" })
    merchant: Merchant;

    @OneToMany(() => Product, (product) => product.merchantCategory)
    products: Product[];

}
