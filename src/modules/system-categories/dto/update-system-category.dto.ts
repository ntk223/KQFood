import { PartialType } from '@nestjs/mapped-types';
import { CreateSystemCategoryDto } from './create-system-category.dto';

export class UpdateSystemCategoryDto extends PartialType(CreateSystemCategoryDto) {}
