import { Injectable } from '@nestjs/common';
import { CreateSystemCategoryDto } from './dto/create-system-category.dto';
import { UpdateSystemCategoryDto } from './dto/update-system-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemCategory } from './entities/system-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SystemCategoriesService {
  constructor(
    @InjectRepository(SystemCategory)
    private systemCategory: Repository<SystemCategory>,
  ){}



  create(createSystemCategoryDto: CreateSystemCategoryDto) {
    
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
