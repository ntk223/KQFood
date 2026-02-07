import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Res,
  Request,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from '@/decorator/customize';
import { User } from './entities/user.entity';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('User created successfully')
  create(@Body() createUserDto: CreateUserDto) : Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ResponseMessage('Users retrieved successfully')
  findAll() : Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) : Promise<User> {
    return this.usersService.findById(+id); 
  }

  @Put()
  @ResponseMessage('User updated successfully')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) :Promise<User> {
    return this.usersService.update(+req.user.sub, updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage('User deleted successfully')
  remove(@Param('id') id: string) : Promise<any> {
    return this.usersService.remove(+id);
  }
}
