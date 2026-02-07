import { EntityManager } from 'typeorm';
import { RoleType } from '@/constants/role';
import { BadRequestException } from '@nestjs/common';
import { Customer } from '@/modules/customers/entities/customer.entity';
import { Merchant } from '@/modules/merchants/entities/merchant.entity';
import { Driver } from '@/modules/drivers/entities/driver.entity';
export async function createProfile(
  manager: EntityManager,
  role: RoleType,
  userId: number,
) {
  const map = {
    [RoleType.CUSTOMER]: Customer,
    [RoleType.DRIVER]: Driver,
    [RoleType.MERCHANT]: Merchant,
  };

  const Entity = map[role];
  if (!Entity) throw new BadRequestException('Invalid role');

  await manager.save(
    manager.create(Entity, { userId }),
  );
}
