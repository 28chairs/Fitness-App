import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event } from '../../entities/event.entity';
import { EventRsvp } from '../../entities/event-rsvp.entity';
import { Repository } from 'typeorm';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: Repository<Event>;

  const mockEventRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockRsvpRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
        {
          provide: getRepositoryToken(EventRsvp),
          useValue: mockRsvpRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const createEventDto = {
        title: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(),
        location: {
          address: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          latitude: 37.7749,
          longitude: -122.4194,
        },
        type: 'single' as const,
      };

      mockEventRepository.create.mockReturnValue(createEventDto);
      mockEventRepository.save.mockResolvedValue({
        ...createEventDto,
        id: 'event-id',
      });

      const result = await service.create('community-id', 'user-id', createEventDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('event-id');
    });
  });
});

