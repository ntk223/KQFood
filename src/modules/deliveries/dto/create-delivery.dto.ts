import { IsNotEmpty, Min } from "class-validator";

export class CreateDeliveryDto {
    @IsNotEmpty()
    orderId: number;

    @IsNotEmpty()
    driverFee: number

    @IsNotEmpty()
    // @Min(-90) // Validate tọa độ địa lý hợp lệ 
    latPickup: number

    @IsNotEmpty()
    longPickup: number

}
