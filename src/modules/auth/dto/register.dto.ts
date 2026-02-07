import { IsEmail, IsNotEmpty, IsOptional } from "class-validator"
import { RoleType } from "@/constants/role"
export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  phone: string;

  @IsOptional()
  avatar: string;

  @IsNotEmpty()
  role: RoleType;
}
