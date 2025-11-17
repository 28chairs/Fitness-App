import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SponsorshipService } from './sponsorship.service';

@ApiTags('Sponsorship')
@Controller('sponsorship')
export class SponsorshipController {
  constructor(private readonly sponsorshipService: SponsorshipService) {}
}


