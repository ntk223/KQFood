import { IsNotEmpty } from "class-validator";

export class CreateOptionGroupDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    isRequired: boolean;

    @IsNotEmpty()
    minChoices: number;

    @IsNotEmpty()
    maxChoices: number;
}
