import { IsNotEmpty } from "class-validator";

export class    CreateSystemCategoryDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    keywords: string[];
}
