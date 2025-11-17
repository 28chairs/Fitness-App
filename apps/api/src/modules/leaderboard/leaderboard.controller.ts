import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';

@ApiTags('Leaderboard')
@Controller('leaderboards')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('communities/:id')
  @ApiOperation({ summary: 'Get local community leaderboard' })
  async getLocalLeaderboard(
    @Param('id') id: string,
    @Query('period') period: string = 'all-time',
  ) {
    return this.leaderboardService.getLocalLeaderboard(id, period);
  }

  @Get('global')
  @ApiOperation({ summary: 'Get global leaderboard' })
  async getGlobalLeaderboard(
    @Query('period') period: string = 'all-time',
    @Query('activityType') activityType?: string,
  ) {
    return this.leaderboardService.getGlobalLeaderboard(period, activityType);
  }
}


