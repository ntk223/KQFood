import { BaseEntity } from "@/base/base.entity";
import { Product } from "@/modules/products/entities/product.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity("system_categories")
export class SystemCategory extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true, type: 'jsonb' })
    keywords: string[];

    @ManyToMany(() => Product, (product) => product.systemCategories)
    products: Product[];
}
