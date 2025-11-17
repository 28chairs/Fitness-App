import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MerchandiseService } from './merchandise.service';

@ApiTags('Merchandise')
@Controller('merchandise')
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}
}


