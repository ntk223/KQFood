import { Module } from '@nestjs/common';
import { MerchantCategoriesService } from './merchant-categories.service';
import { MerchantCategoriesController } from './merchant-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantCategory } from './entities/merchant-category.entity';
@Module({
  imports: [TypeOrmModule.forFeature([MerchantCategory])],
  controllers: [MerchantCategoriesController],
  providers: [MerchantCategoriesService],
})
export class MerchantCategoriesModule {}
