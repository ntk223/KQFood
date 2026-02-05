import { Module } from '@nestjs/common';
import { MerchantCategoriesService } from './merchant-categories.service';
import { MerchantCategoriesController } from './merchant-categories.controller';

@Module({
  controllers: [MerchantCategoriesController],
  providers: [MerchantCategoriesService],
})
export class MerchantCategoriesModule {}
