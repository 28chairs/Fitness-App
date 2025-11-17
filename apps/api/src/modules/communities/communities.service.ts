import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from '../../entities/community.entity';
import { CommunityMember } from '../../entities/community-member.entity';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
    @InjectRepository(CommunityMember)
    private communityMemberRepository: Repository<CommunityMember>,
  ) {}

  async create(userId: string, createDto: CreateCommunityDto): Promise<Community> {
    const community = this.communityRepository.create({
      ...createDto,
      organizerId: userId,
      slug: this.generateSlug(createDto.name),
    });

    return this.communityRepository.save(community);
  }

  async findAll(): Promise<Community[]> {
    return this.communityRepository.find({
      where: { privacy: 'public' },
      relations: ['organizer'],
    });
  }

  async findOne(id: string): Promise<Community> {
    const community = await this.communityRepository.findOne({
      where: { id },
      relations: ['organizer', 'members'],
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    return community;
  }

  async update(id: string, userId: string, updateDto: UpdateCommunityDto): Promise<Community> {
    const community = await this.findOne(id);

    if (community.organizerId !== userId) {
      throw new ForbiddenException('Only the organizer can update the community');
    }

    Object.assign(community, updateDto);
    return this.communityRepository.save(community);
  }

  async join(communityId: string, userId: string): Promise<CommunityMember> {
    const existingMember = await this.communityMemberRepository.findOne({
      where: { communityId, userId },
    });

    if (existingMember) {
      return existingMember;
    }

    const member = this.communityMemberRepository.create({
      communityId,
      userId,
    });

    await this.communityMemberRepository.save(member);

    // Update community member count
    const community = await this.findOne(communityId);
    community.memberCount += 1;
    await this.communityRepository.save(community);

    return member;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}


