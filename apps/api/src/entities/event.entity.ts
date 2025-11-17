import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Community } from './community.entity';
import { EventRSVP } from './event-rsvp.entity';

export enum EventType {
  SINGLE = 'single',
  RECURRING = 'recurring',
}

export enum RecurrencePattern {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('events')
@Index(['communityId', 'startDate'])
@Index(['startDate'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('uuid')
  communityId: string;

  @ManyToOne(() => Community)
  @JoinColumn({ name: 'communityId' })
  community: Community;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.SINGLE,
  })
  type: EventType;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'jsonb' })
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  capacity: number;

  @Column({ default: 0 })
  currentAttendees: number;

  @Column({ type: 'jsonb', nullable: true })
  pricing: {
    type: 'free' | 'fixed' | 'tiered';
    amount?: number;
    currency?: string;
    tiers?: Array<{
      name: string;
      amount: number;
    }>;
    memberDiscount?: number;
  };

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;

  @Column({ type: 'jsonb', nullable: true })
  recurrence: {
    pattern: RecurrencePattern;
    interval: number;
    endDate?: Date;
    exceptions?: Date[];
  };

  @Column({ type: 'jsonb', nullable: true })
  settings: {
    allowWaitlist: boolean;
    requireCheckIn: boolean;
    sendReminders: boolean;
    reminderHoursBefore: number[];
  };

  @OneToMany(() => EventRSVP, (rsvp) => rsvp.event)
  rsvps: EventRSVP[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


