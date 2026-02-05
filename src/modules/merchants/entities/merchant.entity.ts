import { BaseEntity } from "@/base/base.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne,  } from "typeorm";
import type { GeoPoint } from "@/interfaces/geopoint.interface";
import type { OpeningHours } from "@/interfaces/openingHour.interface";
import { User } from "@/modules/users/entities/user.entity";
import { formatTime } from "@/utils/formatTime.helper";
import { Transform } from "class-transformer";
import { MerchantCategory } from "@/modules/merchant-categories/entities/merchant-category.entity";
import { Product } from "@/modules/products/entities/product.entity";
import { OptionGroup } from "@/modules/option-groups/entities/option-group.entity";
import { Order } from "@/modules/orders/entities/order.entity";
@Entity("merchant_profiles")
export class Merchant extends BaseEntity {
    @Column({ nullable: false, unique: true, type: 'int' })
    userId: number;

    @Column({ nullable: false, type: 'varchar' })
    restaurantName: string;

    @Column({ nullable: false, type: 'varchar' })
    address: string;

    @Column({
        type: 'geography',
        spatialFeatureType: 'Point', 
        srid: 4326, // Chuẩn GPS quốc tế
        nullable: true,
    })
    location: GeoPoint;

    @Column({ type: 'jsonb', nullable: true,
        default: {
            monday: { open: "08:00", close: "22:00", isClosed: false },
            tuesday: { open: "08:00", close: "22:00", isClosed: false },
            wednesday: { open: "08:00", close: "22:00", isClosed: false },
            thursday: { open: "08:00", close: "22:00", isClosed: false },
            friday: { open: "08:00", close: "23:00", isClosed: false },
            saturday: { open: "09:00", close: "23:00", isClosed: false },
            sunday: { open: "09:00", close: "21:00", isClosed: false },
        }
    })
    openingHours: OpeningHours;

    @Column({ default: true, type: 'boolean' })
    isActive: boolean;

    @Column({ nullable: true, type: 'numeric' })
    rating: number;

    @Column({ nullable: true, type: 'timestamp' })
    @Transform(({ value }) => {
        if (!value) {
            return null;
        }
        return formatTime(value);
        })
    verifiedAt: Date;

    @OneToOne(() => User, (user) => user.merchant)
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => MerchantCategory, (category) => category.merchant)
    categories: MerchantCategory[];

    @OneToMany(() => Product, (product) => product.merchant)
    products: Product[];

    @OneToMany(() => OptionGroup, (optionGroup) => optionGroup.merchant)
    optionGroups: OptionGroup[];

    @OneToMany(() => Order, (order) => order.merchant)
    orders: Order[];
}
