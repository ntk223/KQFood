import { BaseEntity } from "@/base/base.entity";
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { User } from "@/modules/users/entities/user.entity";
import { Delivery } from "@/modules/deliveries/entities/delivery.entity";
import type { GeoPoint } from "@/interfaces/geopoint.interface";
@Entity("driver_profiles")
export class Driver extends BaseEntity {
    @Column({ nullable: false, type: 'int', unique: true })
    userId: number;

    @Column({ nullable: false, type: 'varchar' })
    licensePlate: string;

    @Column({ nullable: false, type: 'varchar' })
    vehicleType: string;

    @Index({ spatial: true }) // 👈 BẮT BUỘC: Tạo Index để tìm kiếm nhanh
    @Column({
        type: 'geography',
        spatialFeatureType: 'Point', 
        srid: 4326, // Chuẩn GPS quốc tế
        nullable: true,
    })
    currentLocation: GeoPoint;

    @OneToOne(() => User, (user) => user.driver)
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => Delivery, (delivery) => delivery.driver)
    deliveries: Delivery[];
}
