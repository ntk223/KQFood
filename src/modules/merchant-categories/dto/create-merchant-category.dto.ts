import { IsNotEmpty } from "class-validator";

export class CreateMerchantCategoryDto {
    @IsNotEmpty()
    merchantId: number;

    @IsNotEmpty()
    name: string;   
}
