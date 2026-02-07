import { IsNumber, IsOptional, Max, MaxLength, Min, MinLength } from 'class-validator';
import type { OpeningHours } from '@/interfaces/openingHour.interface';

export class UpdateMerchantDto {
    @IsOptional()
    @MaxLength(100)
    @MinLength(3)
    restaurantName?: string;

    @IsOptional()
    address?: string;

    @IsOptional()
    @IsNumber()
    @Min(-90)
    @Max(90)
    lat?: number;  // Vĩ độ (Latitude)

    @IsOptional()
    @IsNumber()
    @Min(-180)
    @Max(180)
    long?: number; // Kinh độ (Longitude)

    @IsOptional()
    openingHours?: OpeningHours;

    @IsOptional()
    isActive?: boolean;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    rating: number;
}
