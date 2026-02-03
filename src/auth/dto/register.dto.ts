import { Exclude } from "class-transformer"
import { IsNotEmpty } from "class-validator"

export class RegisterDto {
    @IsNotEmpty({ message: 'Username should not be empty' })
    userName: string
    
    @IsNotEmpty({ message: 'Full name should not be empty' })
    fullName: string

    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string
}
