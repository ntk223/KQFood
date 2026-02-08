import { IsNotEmpty } from 'class-validator';
export class CreateProductDto {
    @IsNotEmpty()
    merchantId: number

    @IsNotEmpty()
    categoryId: number

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    basePrice: number

    @IsNotEmpty()
    imageUrl: string
    
    @IsNotEmpty()
    isActive: boolean
    
    @IsNotEmpty()
    name: string;
}
