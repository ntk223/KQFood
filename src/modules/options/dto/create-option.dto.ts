import { IsNotEmpty } from "class-validator";

export class CreateOptionDto {

    @IsNotEmpty()
    groupId: number;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    priceAdjustment: number;

    @IsNotEmpty()
    isAvailable: boolean;
}
