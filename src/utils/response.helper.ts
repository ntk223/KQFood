import { ClassConstructor, plainToInstance } from 'class-transformer';

export function standardResponse<T, V>(cls: ClassConstructor<T>, plain: V): T {
  return plainToInstance(cls, plain, { excludeExtraneousValues: true });
}
