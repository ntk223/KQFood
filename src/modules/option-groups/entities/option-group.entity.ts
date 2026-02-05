import { BaseEntity } from "@/base/base.entity";
import { Merchant } from "@/modules/merchants/entities/merchant.entity";
import { Option } from "@/modules/options/entities/option.entity";
import { Product } from "@/modules/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity("option_groups")
export class OptionGroup extends BaseEntity{
    @Column({ nullable: false, type: 'int' })
    merchantId: number;

    @Column({ nullable: false, type: 'varchar' })
    name: string;

    @Column({ nullable: false, default: false, type: 'boolean' })
    isRequired: boolean;

    @Column({ nullable: true, type: 'int' })
    minChoices: number;
    
    @Column({ nullable: true, type: 'int' })
    maxChoices: number;
    
    @ManyToOne(() => Merchant, (merchant) => merchant.optionGroups)
    @JoinColumn({ name: "merchant_id" })
    merchant: Merchant;

    @OneToMany(() => Option, (option) => option.optionGroup)
    options: Option[];

    @ManyToMany(() => Product, (product) => product.optionGroups)
    products: Product[];
}
