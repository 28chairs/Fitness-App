import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Community } from '../../entities/community.entity';
import { Event } from '../../entities/event.entity';
import { Transaction } from '../../entities/transaction.entity';
import { CommunityMember } from '../../entities/community-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Community, Event, Transaction, CommunityMember])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}


