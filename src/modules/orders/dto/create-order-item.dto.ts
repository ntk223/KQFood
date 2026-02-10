// create-order-item.dto.ts
import { IsInt, IsNotEmpty, IsOptional, IsArray, Min } from 'class-validator';

export class OrderItemDto {
    @IsNotEmpty()
    @IsInt()
    productId: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1) // Số lượng ít nhất là 1
    quantity: number;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true }) // Kiểm tra từng phần tử trong mảng phải là số
    optionIds?: number[]; // Nên đặt tên số nhiều (Ids) vì là mảng
}