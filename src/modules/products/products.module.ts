import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MerchantCategory } from '../merchant-categories/entities/merchant-category.entity';
import { SystemCategory } from '../system-categories/entities/system-category.entity';
import { Merchant } from '../merchants/entities/merchant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, MerchantCategory, SystemCategory, Merchant])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
