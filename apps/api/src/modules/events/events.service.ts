import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from '../../entities/event.entity';
import { EventRSVP, RSVPStatus } from '../../entities/event-rsvp.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CommunitiesService } from '../communities/communities.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(EventRSVP)
    private rsvpRepository: Repository<EventRSVP>,
    private communitiesService: CommunitiesService,
  ) {}

  async create(communityId: string, userId: string, createDto: CreateEventDto): Promise<Event> {
    const community = await this.communitiesService.findOne(communityId);

    if (community.organizerId !== userId) {
      throw new ForbiddenException('Only the organizer can create events');
    }

    const event = this.eventRepository.create({
      ...createDto,
      communityId,
    });

    const savedEvent = await this.eventRepository.save(event);

    // Update community event count
    community.eventCount += 1;
    await this.communitiesService['communityRepository'].save(community);

    return savedEvent;
  }

  async findAll(communityId?: string): Promise<Event[]> {
    const where: any = { status: EventStatus.PUBLISHED };
    if (communityId) {
      where.communityId = communityId;
    }

    return this.eventRepository.find({
      where,
      relations: ['community'],
      order: { startDate: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['community', 'rsvps'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(id: string, userId: string, updateDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    const community = await this.communitiesService.findOne(event.communityId);

    if (community.organizerId !== userId) {
      throw new ForbiddenException('Only the organizer can update events');
    }

    Object.assign(event, updateDto);
    return this.eventRepository.save(event);
  }

  async rsvp(eventId: string, userId: string): Promise<EventRSVP> {
    const event = await this.findOne(eventId);

    // Check if already RSVP'd
    const existingRSVP = await this.rsvpRepository.findOne({
      where: { eventId, userId },
    });

    if (existingRSVP) {
      throw new BadRequestException('Already RSVP\'d to this event');
    }

    // Check capacity
    if (event.capacity > 0 && event.currentAttendees >= event.capacity) {
      // Add to waitlist
      const rsvp = this.rsvpRepository.create({
        eventId,
        userId,
        status: RSVPStatus.WAITLISTED,
      });
      return this.rsvpRepository.save(rsvp);
    }

    // Add as confirmed
    const rsvp = this.rsvpRepository.create({
      eventId,
      userId,
      status: RSVPStatus.CONFIRMED,
    });

    await this.rsvpRepository.save(rsvp);

    // Update event attendee count
    event.currentAttendees += 1;
    await this.eventRepository.save(event);

    return rsvp;
  }

  async cancelRsvp(eventId: string, userId: string): Promise<void> {
    const rsvp = await this.rsvpRepository.findOne({
      where: { eventId, userId },
    });

    if (!rsvp) {
      throw new NotFoundException('RSVP not found');
    }

    await this.rsvpRepository.remove(rsvp);

    // Update event attendee count
    const event = await this.findOne(eventId);
    if (rsvp.status === RSVPStatus.CONFIRMED) {
      event.currentAttendees = Math.max(0, event.currentAttendees - 1);
      await this.eventRepository.save(event);
    }
  }
}


