import { Controller } from '@nestjs/common';
import { CompanionService } from './companion.service';

@Controller()
export class CompanionController {
  constructor(private readonly companionService: CompanionService) {}
}
