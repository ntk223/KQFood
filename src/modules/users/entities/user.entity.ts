import { Exclude } from 'class-transformer';
import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '@/base/base.entity';
import { RoleType } from '@/constants/role';
import { Customer } from '@/modules/customers/entities/customer.entity';
import { Driver } from '@/modules/drivers/entities/driver.entity';
import { Merchant } from '@/modules/merchants/entities/merchant.entity';
import { UserStatus } from '@/constants/userStatus';
@Entity("users")
export class User extends BaseEntity {
  @Column({ unique: true, nullable: false, type: 'varchar' })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ nullable: false, type: 'varchar' })
  fullName: string;

  @Column({ nullable: false, type: 'varchar' })
  phone: string;

  @Column({ nullable: true, type: 'varchar' })
  avatar: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    array: true,
    default: [RoleType.CUSTOMER], // Default cũng phải để trong mảng
  })
  roles: RoleType[];

  @Column({ default: UserStatus.ACTIVE, type: 'enum', enum: UserStatus })
  status: UserStatus;

  @Column({ nullable: true, type: 'varchar' })
  @Exclude()
  refreshTokenHash: string;

  @OneToOne(() => Customer, (customer) => customer.user)
  customer: Customer;

  @OneToOne(() => Driver, (driver) => driver.user)
  driver: Driver;

  @OneToOne(() => Merchant, (merchant) => merchant.user)
  merchant: Merchant;
}
