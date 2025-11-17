import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { CommunitiesService } from '../communities/communities.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class SearchService {
  private client: Client;

  constructor(
    private configService: ConfigService,
    private communitiesService: CommunitiesService,
    private eventsService: EventsService,
  ) {
    this.client = new Client({
      node: this.configService.get<string>('ELASTICSEARCH_NODE', 'http://localhost:9200'),
    });
  }

  async searchCommunities(query: {
    search?: string;
    category?: string;
    location?: { lat: number; lon: number; radius: string };
    priceRange?: { min?: number; max?: number };
  }) {
    // For MVP, fallback to database search
    // In production, implement Elasticsearch queries
    const communities = await this.communitiesService.findAll();
    
    let results = communities;

    if (query.search) {
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(query.search.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.search.toLowerCase())
      );
    }

    if (query.category) {
      results = results.filter((c) => c.category === query.category);
    }

    return results;
  }

  async searchEvents(query: {
    search?: string;
    communityId?: string;
    location?: { lat: number; lon: number; radius: string };
    dateRange?: { start?: Date; end?: Date };
  }) {
    const events = await this.eventsService.findAll(query.communityId);

    let results = events;

    if (query.search) {
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(query.search.toLowerCase()) ||
          e.description?.toLowerCase().includes(query.search.toLowerCase())
      );
    }

    if (query.dateRange?.start) {
      results = results.filter((e) => e.startDate >= query.dateRange.start);
    }

    if (query.dateRange?.end) {
      results = results.filter((e) => e.endDate <= query.dateRange.end);
    }

    return results;
  }

  async indexCommunity(communityId: string): Promise<void> {
    // Index community in Elasticsearch
    // Implementation for production
  }

  async indexEvent(eventId: string): Promise<void> {
    // Index event in Elasticsearch
    // Implementation for production
  }
}


