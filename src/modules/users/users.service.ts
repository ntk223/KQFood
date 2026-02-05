import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '../../utils/password.helper';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(createUserDto.password);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneByEmail(email : string) : Promise<User>  {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async checkExistByEmail(email : string) : Promise<boolean>  {
    const count = await this.usersRepository.countBy({ email });
    return count > 0;
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
    await this.usersRepository.update(id, { refreshTokenHash: rtHash });
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
