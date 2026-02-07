import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from './entities/merchant.entity';
import { GeoPoint } from '@/interfaces/geopoint.interface';
@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
  ){}  
  create(createMerchantDto: CreateMerchantDto) {
    return 'This action adds a new merchant';
  }

  findAll() {
    return `This action returns all merchants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} merchant`;
  }

  async update(id: number, updateMerchantDto: UpdateMerchantDto) {
    const merchant = await this.merchantRepository.findOneBy({id});
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    if (updateMerchantDto.lat !== undefined && updateMerchantDto.long !== undefined) {
      const location: GeoPoint = {
        type: 'Point',
        coordinates: [updateMerchantDto.long, updateMerchantDto.lat],
      };
        merchant.location = location;
    }
    
    Object.assign(merchant, updateMerchantDto);
    return this.merchantRepository.save(merchant);
  }

  remove(id: number) {
    return `This action removes a #${id} merchant`;
  }
}
