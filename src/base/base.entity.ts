import { Expose, Transform } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { formatTime } from '@/utils/formatTime.helper';

export abstract class BaseEntity {
  @Expose()
  @CreateDateColumn()
  @Transform(({ value }) => {
    return formatTime(value);
  })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  @Transform(({ value }) => {
    return formatTime(value);
  })
  updatedAt: Date;

  @Expose()
  @DeleteDateColumn()
  @Transform(({ value }) => {
    if (!value) {
      return null;
    }
    return formatTime(value);
  })
  deletedAt: Date;

  @Expose()
  @PrimaryGeneratedColumn()
  id: number;
}