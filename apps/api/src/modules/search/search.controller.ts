import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('communities')
  @ApiOperation({ summary: 'Search communities' })
  async searchCommunities(@Query() query: any) {
    return this.searchService.searchCommunities(query);
  }

  @Get('events')
  @ApiOperation({ summary: 'Search events' })
  async searchEvents(@Query() query: any) {
    return this.searchService.searchEvents(query);
  }
}


