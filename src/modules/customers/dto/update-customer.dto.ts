import { Type } from 'class-transformer';
import { SavedLocationDto } from './save-location.dto';
import { IsArray, ValidateNested } from 'class-validator';

export class UpdateCustomerDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SavedLocationDto) 
    savedLocations?: SavedLocationDto[];
}
