import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PremiumService } from './premium.service';

@ApiTags('Premium')
@Controller('premium')
export class PremiumController {
  constructor(private readonly premiumService: PremiumService) {}
}


