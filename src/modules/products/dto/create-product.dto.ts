import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';
export class CreateProductDto {
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

    @IsOptional()
    @IsArray()
    optionGroupIds?: number[];
}
