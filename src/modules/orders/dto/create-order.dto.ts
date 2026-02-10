// create-order.dto.ts
import { 
    IsNotEmpty, IsNumber, IsOptional, IsString, 
    ValidateNested, IsEnum, Min, Max, IsArray, ArrayMinSize 
} from "class-validator";
import { Type } from "class-transformer";
import { OrderItemDto } from './create-order-item.dto';
import { PaymentMethod } from "@/constants/paymentMethod";


export class CreateOrderDto {
    @IsNumber()
    @IsNotEmpty()
    merchantId: number;


    @IsNotEmpty()
    @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ' })
    paymentMethod: PaymentMethod;

    @IsString()
    @IsNotEmpty()
    deliveryAddress: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(-90) @Max(90) // Validate tọa độ địa lý hợp lệ
    deliveryLat: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(-180) @Max(180)
    deliveryLong: number;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    products: OrderItemDto[];
}

/**
 * Mock data req body json
 {
    "merchantId": 1,
    "paymentMethod": "CASH",
    "deliveryAddress": "123 Main St, Cityville",
    "deliveryLat": 10.762622,
    "deliveryLong": 106.660172,
    "products": [
        {
            "productId": 1,
            "quantity": 2,
            "optionIds": [1, 2]
        },
        {
            "productId": 2,
            "quantity": 1
        }
    ]
 }
 */