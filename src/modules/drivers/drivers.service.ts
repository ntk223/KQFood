import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { Repository } from 'typeorm';
import { GeoPoint } from '@/interfaces/geopoint.interface';
@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}
  create(createDriverDto: CreateDriverDto) {
    return 'This action adds a new driver';
  }

  findAll() {
    return `This action returns all drivers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} driver`;
  }

  async update(id: number, updateDriverDto: UpdateDriverDto) : Promise<Driver>{
    const driver = await this.driverRepository.findOneBy({id});
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }
    if (updateDriverDto.lat !== undefined && updateDriverDto.long !== undefined) {
      const location: GeoPoint = {
        type: 'Point',
        coordinates: [updateDriverDto.long, updateDriverDto.lat],
      };
      driver.currentLocation = location;
    }
    Object.assign(driver, updateDriverDto);
    return this.driverRepository.save(driver);
  }

  remove(id: number) {
    return `This action removes a #${id} driver`;
  }
}
