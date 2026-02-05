import { PartialType } from '@nestjs/mapped-types';
import { CreateMerchantCategoryDto } from './create-merchant-category.dto';

export class UpdateMerchantCategoryDto extends PartialType(CreateMerchantCategoryDto) {}
