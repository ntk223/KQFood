import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MerchantCategoriesService } from './merchant-categories.service';
import { CreateMerchantCategoryDto } from './dto/create-merchant-category.dto';
import { UpdateMerchantCategoryDto } from './dto/update-merchant-category.dto';
import { Roles } from '@/decorator/customize';
import { RoleType } from '@/constants/role';

@Controller('merchant-categories')
export class MerchantCategoriesController {
  constructor(private readonly merchantCategoriesService: MerchantCategoriesService) {}

  @Post()
  @Roles(RoleType.MERCHANT)
  create(@Body() createMerchantCategoryDto: CreateMerchantCategoryDto) {
    return this.merchantCategoriesService.create(createMerchantCategoryDto);
  }

  @Get()
  findAll() {
    return this.merchantCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.merchantCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMerchantCategoryDto: UpdateMerchantCategoryDto) {
    return this.merchantCategoriesService.update(+id, updateMerchantCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.merchantCategoriesService.remove(+id);
  }
}
