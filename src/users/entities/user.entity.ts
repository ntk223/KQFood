import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/base/base.entity';
@Entity()
export class User extends BaseEntity {
  @Column()
  userName: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  @Exclude()
  hashedRefreshToken: string;
}
