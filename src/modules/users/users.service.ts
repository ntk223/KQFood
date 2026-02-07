import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword, comparePassword } from '../../utils/password.helper';
import { RoleType } from '@/constants/role';
import { createProfile } from '@/utils/createProfile.helper';
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

  async addRoleToUser(userId: number, role: RoleType, password: string, manager: EntityManager) : Promise<User> {
      const userRepo = manager.getRepository(User);
      const user = await userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const passwordMatches = await comparePassword(password, user.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Incorrect password');
      }
      if (user.roles.includes(role)) {
        throw new ConflictException(`User already has role ${role}`);
      }
      user.roles.push(role);
      const updatedUser = await userRepo.save(user);
      await createProfile(manager, role, user.id);
      return updatedUser;
  }
}
