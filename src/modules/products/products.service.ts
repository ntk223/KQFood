import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { SystemCategory } from '../system-categories/entities/system-category.entity';
import { Merchant } from '../merchants/entities/merchant.entity';
import { MerchantCategory } from '../merchant-categories/entities/merchant-category.entity';
import { matchesKeywords } from '@/utils/autoTagging.helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private product: Repository<Product>,
    @InjectRepository(SystemCategory)
    private systemCategory: Repository<SystemCategory>,
    // @InjectRepository(Merchant)
    // private merchant: Repository<Merchant>,
    // @InjectRepository(MerchantCategory)
    // private merchantCategory: Repository<MerchantCategory>,
  ){}
  
  async create(createProductDto: CreateProductDto) {
    // Tạo product entity
    const newProduct = this.product.create(createProductDto);
    
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
    
    // Trả về product với relations
    return this.product.findOne({
      where: { id: savedProduct.id },
      relations: ['systemCategories']
    });
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
