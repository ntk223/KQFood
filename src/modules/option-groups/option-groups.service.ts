import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOptionGroupDto } from './dto/create-option-group.dto';
import { UpdateOptionGroupDto } from './dto/update-option-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionGroup } from './entities/option-group.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OptionGroupsService {
  constructor(
    @InjectRepository(OptionGroup)
    private optionGroupRepository: Repository<OptionGroup>,
    @InjectRepository(User)
    private user: Repository<User>,
  ) {}

  async create(createOptionGroupDto: CreateOptionGroupDto, req: any) {
    const userId = req.user.sub;
    const userWithMerchant = await this.user.findOne({
      where: { id: userId },
      relations: ['merchant']
    });
    
    if (!userWithMerchant || !userWithMerchant.merchant) {
      console.log(userWithMerchant);
      throw new BadRequestException('User không có merchant profile');
    }
    
    const merchantId = userWithMerchant.merchant.id;
    const newOptionGroup = this.optionGroupRepository.create({
      ...createOptionGroupDto,
      merchantId,
    });
    return this.optionGroupRepository.save(newOptionGroup);
  }

  findByMerchant(merchantId: number) {
    return this.optionGroupRepository.find({
      where: { merchantId },
      relations: ['options'],
      order: { createdAt: 'DESC' }
    });
  }

  findAll() {
    return this.optionGroupRepository.find({
      relations: ['options'],
      order: { createdAt: 'DESC' }
    });
  }

  findOne(id: number) {
    return this.optionGroupRepository.findOne({
      where: { id },
      relations: ['options']
    });
  }

  update(id: number, updateOptionGroupDto: UpdateOptionGroupDto) {
    return `This action updates a #${id} optionGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} optionGroup`;
  }
}
