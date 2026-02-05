import { Module } from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { OptionGroupsController } from './option-groups.controller';

@Module({
  controllers: [OptionGroupsController],
  providers: [OptionGroupsService],
})
export class OptionGroupsModule {}
