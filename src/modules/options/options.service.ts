import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option } from './entities/option.entity';
import { Repository } from 'typeorm/repository/Repository.js';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>
  ){}
  create(createOptionDto: CreateOptionDto) {
    const newOption = this.optionRepository.create(createOptionDto);
    return this.optionRepository.save(newOption);
  }

  findByGroup(groupId: number) {
    return this.optionRepository.find({
      where: { groupId },
      order: { createdAt: 'ASC' }
    });
  }

  findAll() {
    return this.optionRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  findOne(id: number) {
    return this.optionRepository.findOne({
      where: { id }
    });
  }

  update(id: number, updateOptionDto: UpdateOptionDto) {
    return `This action updates a #${id} option`;
  }

  remove(id: number) {
    return `This action removes a #${id} option`;
  }
}
