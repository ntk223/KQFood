import { Injectable } from '@nestjs/common';
import { CreateSystemCategoryDto } from './dto/create-system-category.dto';
import { UpdateSystemCategoryDto } from './dto/update-system-category.dto';

@Injectable()
export class SystemCategoriesService {
  create(createSystemCategoryDto: CreateSystemCategoryDto) {
    return 'This action adds a new systemCategory';
  }

  findAll() {
    return `This action returns all systemCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemCategory`;
  }

  update(id: number, updateSystemCategoryDto: UpdateSystemCategoryDto) {
    return `This action updates a #${id} systemCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemCategory`;
  }
}
