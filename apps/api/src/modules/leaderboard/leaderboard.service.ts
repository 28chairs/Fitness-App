import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityMember } from '../../entities/community-member.entity';
import { EventRSVP, RSVPStatus } from '../../entities/event-rsvp.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(CommunityMember)
    private memberRepository: Repository<CommunityMember>,
    @InjectRepository(EventRSVP)
    private rsvpRepository: Repository<EventRSVP>,
    private redisService: RedisService,
  ) {}

  async getLocalLeaderboard(communityId: string, timePeriod: string = 'all-time') {
    const key = `leaderboard:community:${communityId}:${timePeriod}`;
    
    // Try to get from cache
    const cached = await this.redisService.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    // Calculate scores
    const members = await this.memberRepository.find({
      where: { communityId },
      relations: ['user'],
      order: { points: 'DESC' },
      take: 100,
    });

    const leaderboard = members.map((member, index) => ({
      rank: index + 1,
      userId: member.userId,
      userName: `${member.user.firstName} ${member.user.lastName}`,
      avatarUrl: member.user.avatarUrl,
      points: member.points,
      eventsAttended: member.eventsAttended,
      checkIns: member.checkIns,
    }));

    // Cache for 5 minutes
    await this.redisService.set(key, JSON.stringify(leaderboard), 300);

    return leaderboard;
  }

  async getGlobalLeaderboard(timePeriod: string = 'all-time', activityType?: string) {
    const key = `leaderboard:global:${timePeriod}:${activityType || 'all'}`;
    
    // Try to get from cache
    const cached = await this.redisService.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    // For MVP, aggregate from all communities
    const members = await this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .leftJoinAndSelect('member.community', 'community')
      .select([
        'member.userId',
        'user.firstName',
        'user.lastName',
        'user.avatarUrl',
        'SUM(member.points) as totalPoints',
        'SUM(member.eventsAttended) as totalEvents',
      ])
      .groupBy('member.userId')
      .addGroupBy('user.id')
      .orderBy('totalPoints', 'DESC')
      .limit(100)
      .getRawMany();

    const leaderboard = members.map((member, index) => ({
      rank: index + 1,
      userId: member.member_userId,
      userName: `${member.user_firstName} ${member.user_lastName}`,
      avatarUrl: member.user_avatarUrl,
      points: parseFloat(member.totalPoints || '0'),
      eventsAttended: parseInt(member.totalEvents || '0', 10),
    }));

    // Cache for 5 minutes
    await this.redisService.set(key, JSON.stringify(leaderboard), 300);

    return leaderboard;
  }

  async updateUserScore(userId: string, communityId: string, points: number) {
    let member = await this.memberRepository.findOne({
      where: { userId, communityId },
    });

    if (!member) {
      member = this.memberRepository.create({ userId, communityId, points: 0 });
    }

    member.points += points;
    await this.memberRepository.save(member);

    // Invalidate cache
    await this.redisService.del(`leaderboard:community:${communityId}:*`);
    await this.redisService.del('leaderboard:global:*');
  }
}


