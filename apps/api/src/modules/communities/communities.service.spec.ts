import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommunitiesService } from './communities.service';
import { Community } from '../../entities/community.entity';
import { CommunityMember } from '../../entities/community-member.entity';
import { Repository } from 'typeorm';

describe('CommunitiesService', () => {
  let service: CommunitiesService;
  let communityRepository: Repository<Community>;

  const mockCommunityRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockMemberRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunitiesService,
        {
          provide: getRepositoryToken(Community),
          useValue: mockCommunityRepository,
        },
        {
          provide: getRepositoryToken(CommunityMember),
          useValue: mockMemberRepository,
        },
      ],
    }).compile();

    service = module.get<CommunitiesService>(CommunitiesService);
    communityRepository = module.get<Repository<Community>>(getRepositoryToken(Community));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

