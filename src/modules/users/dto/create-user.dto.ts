import { IsEmail, IsNotEmpty } from 'class-validator';
import { RoleType } from '@/constants/role';
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  roles: RoleType[];
}
