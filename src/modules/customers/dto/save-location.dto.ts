import { SavedLocation } from '@/interfaces/location.interface';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class SavedLocationDto implements SavedLocation {
  @IsNotEmpty()
  @IsString()
  name: string; // VD: "Nhà riêng", "Công ty"

  @IsNotEmpty()
  @IsString()
  address: string; // VD: "123 Đường ABC..."

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  long: number;
}