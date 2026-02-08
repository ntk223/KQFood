import { Roles } from './../../decorator/customize';
import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { CreateOptionGroupDto } from './dto/create-option-group.dto';
import { UpdateOptionGroupDto } from './dto/update-option-group.dto';
import { RoleType } from '@/constants/role';

@Controller('option-groups')
export class OptionGroupsController {
  constructor(private readonly optionGroupsService: OptionGroupsService) {}

  @Post()
  @Roles(RoleType.MERCHANT)
  create(@Body() createOptionGroupDto: CreateOptionGroupDto, @Request() req: any) {
    return this.optionGroupsService.create(createOptionGroupDto, req);
  }

  @Get()
  findAll() {
    return this.optionGroupsService.findAll();
  }

  @Get('merchant/:merchantId')
  @Roles(RoleType.MERCHANT)
  findByMerchant(@Param('merchantId') merchantId: string) {
    return this.optionGroupsService.findByMerchant(+merchantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionGroupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOptionGroupDto: UpdateOptionGroupDto) {
    return this.optionGroupsService.update(+id, updateOptionGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionGroupsService.remove(+id);
  }
}
