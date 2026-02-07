import type { GeoPoint } from "@/interfaces/geopoint.interface";
import { IsOptional, Max, IsNumber, Min } from "class-validator";

export class UpdateDriverDto {
    @IsOptional()
    licensePlate?: string;

    @IsOptional()
    vehicleType?: string;

    @IsOptional()
    isOnline?: boolean;

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
}
