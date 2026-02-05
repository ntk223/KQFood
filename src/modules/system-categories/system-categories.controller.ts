import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SystemCategoriesService } from './system-categories.service';
import { CreateSystemCategoryDto } from './dto/create-system-category.dto';
import { UpdateSystemCategoryDto } from './dto/update-system-category.dto';

@Controller('system-categories')
export class SystemCategoriesController {
  constructor(private readonly systemCategoriesService: SystemCategoriesService) {}

  @Post()
  create(@Body() createSystemCategoryDto: CreateSystemCategoryDto) {
    return this.systemCategoriesService.create(createSystemCategoryDto);
  }

  @Get()
  findAll() {
    return this.systemCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSystemCategoryDto: UpdateSystemCategoryDto) {
    return this.systemCategoriesService.update(+id, updateSystemCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemCategoriesService.remove(+id);
  }
}
