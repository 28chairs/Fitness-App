import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('communities/:communityId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event' })
  async create(
    @Param('communityId') communityId: string,
    @Req() req,
    @Body() createDto: CreateEventDto,
  ) {
    return this.eventsService.create(communityId, req.user.id, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  async findAll(@Query('communityId') communityId?: string) {
    return this.eventsService.findAll(communityId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event' })
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, req.user.id, updateDto);
  }

  @Post(':id/rsvp')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'RSVP to an event' })
  async rsvp(@Param('id') id: string, @Req() req) {
    return this.eventsService.rsvp(id, req.user.id);
  }

  @Delete(':id/rsvp')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel RSVP' })
  async cancelRsvp(@Param('id') id: string, @Req() req) {
    return this.eventsService.cancelRsvp(id, req.user.id);
  }
}


