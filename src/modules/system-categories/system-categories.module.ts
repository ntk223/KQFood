import { Module } from '@nestjs/common';
import { SystemCategoriesService } from './system-categories.service';
import { SystemCategoriesController } from './system-categories.controller';

@Module({
  controllers: [SystemCategoriesController],
  providers: [SystemCategoriesService],
})
export class SystemCategoriesModule {}
