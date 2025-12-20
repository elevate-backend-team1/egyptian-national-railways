import { Controller } from '@nestjs/common';
import { CompanionService } from './companion.service';

@ApiTags('companions')
@Controller('companions')
export class CompanionController {
  constructor(private readonly companionService: CompanionService) {}
}
