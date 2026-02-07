import {IsOptional, IsPhoneNumber, IsUrl, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @MaxLength(50)
    @MinLength(3)
    fullName?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @IsOptional()
    @IsUrl()
    avatar?: string;
}
