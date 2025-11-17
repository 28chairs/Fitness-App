import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Community } from '../../entities/community.entity';
import { Event } from '../../entities/event.entity';
import { Transaction, TransactionStatus } from '../../entities/transaction.entity';
import { CommunityMember } from '../../entities/community-member.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(CommunityMember)
    private memberRepository: Repository<CommunityMember>,
  ) {}

  async getCommunityAnalytics(communityId: string, userId: string) {
    const community = await this.communityRepository.findOne({
      where: { id: communityId },
    });

    if (!community || community.organizerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const [memberCount, eventCount, totalRevenue, recentEvents] = await Promise.all([
      this.memberRepository.count({ where: { communityId } }),
      this.eventRepository.count({ where: { communityId } }),
      this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.organizerAmount)', 'total')
        .where('transaction.communityId = :communityId', { communityId })
        .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
        .getRawOne(),
      this.eventRepository.find({
        where: { communityId },
        take: 10,
        order: { startDate: 'DESC' },
      }),
    ]);

    return {
      memberCount,
      eventCount,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
      recentEvents: recentEvents.length,
      growth: {
        members: 0, // Calculate from historical data
        events: 0,
        revenue: 0,
      },
    };
  }

  async getEventMetrics(communityId: string, userId: string, startDate?: Date, endDate?: Date) {
    const community = await this.communityRepository.findOne({
      where: { id: communityId },
    });

    if (!community || community.organizerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const where: any = { communityId };
    if (startDate && endDate) {
      where.startDate = Between(startDate, endDate);
    }

    const events = await this.eventRepository.find({ where });

    const metrics = {
      totalEvents: events.length,
      totalAttendees: events.reduce((sum, e) => sum + e.currentAttendees, 0),
      averageAttendance: events.length > 0
        ? events.reduce((sum, e) => sum + e.currentAttendees, 0) / events.length
        : 0,
      popularEvents: events
        .sort((a, b) => b.currentAttendees - a.currentAttendees)
        .slice(0, 5)
        .map((e) => ({
          id: e.id,
          title: e.title,
          attendees: e.currentAttendees,
          date: e.startDate,
        })),
    };

    return metrics;
  }
}


