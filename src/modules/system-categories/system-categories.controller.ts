import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SystemCategoriesService } from './system-categories.service';
import { CreateSystemCategoryDto } from './dto/create-system-category.dto';
import { UpdateSystemCategoryDto } from './dto/update-system-category.dto';
import { Roles, Public } from '@/decorator/customize';
import { RoleType } from '@/constants/role';

@Controller('system-categories')
export class SystemCategoriesController {
  constructor(private readonly systemCategoriesService: SystemCategoriesService) {}

  @Post()
  @Roles(RoleType.ADMIN) 
  create(@Body() createSystemCategoryDto: CreateSystemCategoryDto) {
    return this.systemCategoriesService.create(createSystemCategoryDto);
  }

  @Get()
  @Public() 
  findAll() {
    return this.systemCategoriesService.findAll();
  }

  @Get(':id')
  @Public() 
  findOne(@Param('id') id: string) {
    return this.systemCategoriesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RoleType.ADMIN) // ✅ Chỉ Admin mới cập nhật
  update(@Param('id') id: string, @Body() updateSystemCategoryDto: UpdateSystemCategoryDto) {
    return this.systemCategoriesService.update(+id, updateSystemCategoryDto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN) // ✅ Chỉ Admin mới xóa
  remove(@Param('id') id: string) {
    return this.systemCategoriesService.remove(+id);
  }
}
