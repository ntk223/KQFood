import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPasword } from '../utils/password.helper';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPasword(createUserDto.password);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(userName : string) : Promise<User>  {
    const user = await this.usersRepository.findOneBy({ userName });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id : number) : Promise<User>  {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) : Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }
  async updateRtHashed (id: number, rtHash: any) : Promise<void> {
    await this.usersRepository.update(id, { hashedRefreshToken: rtHash });
  }
  async remove(id: number) : Promise<any> {
    const result = await this.usersRepository.createQueryBuilder()
                  .softDelete()
                  .where("id = :id", { id })
                  .andWhere("deletedAt IS NULL")
                  .execute();
    if (result.affected === 0) {
      throw new NotFoundException('User not found or already deleted');
    }
    return {
      deletedId: id,
    }
  }
}
