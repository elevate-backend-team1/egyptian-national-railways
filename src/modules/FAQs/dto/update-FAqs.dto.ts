import { PartialType } from '@nestjs/mapped-types';
import { CreateFAQsDto } from './create-FAQs.dto';

export class UpdateFAQsDto extends PartialType(CreateFAQsDto) {}
