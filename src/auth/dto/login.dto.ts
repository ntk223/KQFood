import { IsNotEmpty } from "class-validator"

export class LoginDto {
    @IsNotEmpty({ message: 'Username should not be empty' })
    userName: string

    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string
}
