import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('communities/:id')
  @ApiOperation({ summary: 'Get community analytics' })
  async getCommunityAnalytics(@Param('id') id: string, @Req() req) {
    return this.analyticsService.getCommunityAnalytics(id, req.user.id);
  }

  @Get('communities/:id/events')
  @ApiOperation({ summary: 'Get event metrics' })
  async getEventMetrics(
    @Param('id') id: string,
    @Req() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getEventMetrics(
      id,
      req.user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}


