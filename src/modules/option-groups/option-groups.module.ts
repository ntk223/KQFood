import { Module } from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { OptionGroupsController } from './option-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionGroup } from './entities/option-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OptionGroup])],
  controllers: [OptionGroupsController],
  providers: [OptionGroupsService],
})
export class OptionGroupsModule {}
