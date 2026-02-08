import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MerchantCategory } from '../merchant-categories/entities/merchant-category.entity';
import { SystemCategory } from '../system-categories/entities/system-category.entity';
import { Merchant } from '../merchants/entities/merchant.entity';
import { OptionGroup } from '../option-groups/entities/option-group.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, MerchantCategory, SystemCategory, Merchant, OptionGroup, User])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
