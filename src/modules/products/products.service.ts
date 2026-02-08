import { User } from './../users/entities/user.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { SystemCategory } from '../system-categories/entities/system-category.entity';
import { Merchant } from '../merchants/entities/merchant.entity';
import { MerchantCategory } from '../merchant-categories/entities/merchant-category.entity';
import { OptionGroup } from '../option-groups/entities/option-group.entity';
import { matchesKeywords } from '@/utils/autoTagging.helper';
import { log } from 'console';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private product: Repository<Product>,
    @InjectRepository(SystemCategory)
    private systemCategory: Repository<SystemCategory>,
    @InjectRepository(OptionGroup)
    private optionGroup: Repository<OptionGroup>,
    @InjectRepository(User)
    private user: Repository<User>,
  ){}
  
  async create(createProductDto: CreateProductDto, req: any) {
    const userId = req.user.sub;
    
    const userWithMerchant = await this.user.findOne({
      where: { id: userId },
      relations: ['merchant']
    });
    
    if (!userWithMerchant || !userWithMerchant.merchant) {
      log(userWithMerchant);
      throw new BadRequestException('User không có merchant profile');
    }
    
    const merchantId = userWithMerchant.merchant.id;
    
    const newProduct = this.product.create({
      ...createProductDto,
      merchantId
    });
    
    // Bước 1: Save product trước (không có relations)
    const savedProduct = await this.product.save(newProduct);
    
    // Bước 2: Auto-tagging - Tìm SystemCategory phù hợp
    const allCategories = await this.systemCategory.find();
    const detectedCategories: SystemCategory[] = [];
    
    // Kết hợp tên sản phẩm + mô tả để matching
    const searchText = `${createProductDto.name} ${createProductDto.description || ''}`;
    
    for (const category of allCategories) {
      // Nếu category có keywords và match với tên/mô tả sản phẩm
      if (category.keywords && category.keywords.length > 0) {
        if (matchesKeywords(searchText, category.keywords)) {
          detectedCategories.push(category);
        }
      }
    }
    
    // Bước 3: Gắn các SystemCategory vào product và save lại
    if (detectedCategories.length > 0) {
      savedProduct.systemCategories = detectedCategories;
      await this.product.save(savedProduct);
    }

    // Bước 4: Xử lý OptionGroups nếu có
    if (createProductDto.optionGroupIds && createProductDto.optionGroupIds.length > 0) {
      const optionGroups = await this.optionGroup.findByIds(createProductDto.optionGroupIds);
      if (optionGroups.length > 0) {
        savedProduct.optionGroups = optionGroups;
        await this.product.save(savedProduct);
      }
    }
    
    // Trả về product với relations
    return this.product.findOne({
      where: { id: savedProduct.id },
      relations: ['systemCategories', 'optionGroups', 'optionGroups.options']
    });
  }

  findAll() {
    return this.product.find({
      relations: ['systemCategories', 'optionGroups', 'optionGroups.options', 'merchantCategory'],
      order: { createdAt: 'DESC' }
    });
  }

  findOne(id: number) {
    return this.product.findOne({
      where: { id },
      relations: ['systemCategories', 'optionGroups', 'optionGroups.options', 'merchantCategory', 'merchant']
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
