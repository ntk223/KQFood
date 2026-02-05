import { Injectable } from '@nestjs/common';
import { CreateMerchantCategoryDto } from './dto/create-merchant-category.dto';
import { UpdateMerchantCategoryDto } from './dto/update-merchant-category.dto';

@Injectable()
export class MerchantCategoriesService {
  create(createMerchantCategoryDto: CreateMerchantCategoryDto) {
    return 'This action adds a new merchantCategory';
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
