import { Module } from '@nestjs/common';
import { SystemCategoriesService } from './system-categories.service';
import { SystemCategoriesController } from './system-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemCategory } from './entities/system-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemCategory])],
  controllers: [SystemCategoriesController],
  providers: [SystemCategoriesService],
})
export class SystemCategoriesModule {}
