import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Communities')
@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new community' })
  async create(@Req() req, @Body() createDto: CreateCommunityDto) {
    return this.communitiesService.create(req.user.id, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all public communities' })
  async findAll() {
    return this.communitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get community by ID' })
  async findOne(@Param('id') id: string) {
    return this.communitiesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update community' })
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateDto: UpdateCommunityDto,
  ) {
    return this.communitiesService.update(id, req.user.id, updateDto);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join a community' })
  async join(@Param('id') id: string, @Req() req) {
    return this.communitiesService.join(id, req.user.id);
  }
}


