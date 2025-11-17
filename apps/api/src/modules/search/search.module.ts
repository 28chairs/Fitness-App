import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { CommunitiesModule } from '../communities/communities.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [CommunitiesModule, EventsModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}


