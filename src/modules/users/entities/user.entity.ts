import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/base/base.entity';
import { RoleType } from '@/constants/role';


@Entity("users")
/**
 *email varchar [unique, not null]
  password varchar [not null]
  full_name varchar
  phone varchar
  avatar varchar
  roles role_type[] [default: "CUSTOMER"] 
  status varchar [default: 'ACTIVE'] 
  refresh_token_hash varchar
 */
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    array: true,
    default: [RoleType.CUSTOMER], // Default cũng phải để trong mảng
  })
  roles: RoleType[];

  @Column({ default: 'ACTIVE' })
  status: string;

  @Column({ nullable: true })
  @Exclude()
  refreshTokenHash: string;
}
