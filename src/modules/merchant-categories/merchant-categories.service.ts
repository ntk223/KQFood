import { Injectable } from '@nestjs/common';
import { CreateMerchantCategoryDto } from './dto/create-merchant-category.dto';
import { UpdateMerchantCategoryDto } from './dto/update-merchant-category.dto';
import { MerchantCategory } from './entities/merchant-category.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

@Injectable()
export class MerchantCategoriesService {
  constructor(
    @InjectRepository(MerchantCategory)
    private merchantCategory: Repository<MerchantCategory>,
  ){
  }
  create(createMerchantCategoryDto: CreateMerchantCategoryDto) {
    const newCategory = this.merchantCategory.create(createMerchantCategoryDto);
    return this.merchantCategory.save(newCategory);
  }

  findAll() {
    return `This action returns all merchantCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} merchantCategory`;
  }

  update(id: number, updateMerchantCategoryDto: UpdateMerchantCategoryDto) {
    return `This action updates a #${id} merchantCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} merchantCategory`;
  }
}
