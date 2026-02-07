import { IsNotEmpty } from "class-validator";
import { Not } from "typeorm";

export class CreateSystemCategoryDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    keywords: JSON;
}
