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
import { User } from './user.entity';
import { Event } from './event.entity';
import { CommunityMember } from './community-member.entity';
import { Membership } from './membership.entity';

export enum CommunityCategory {
  RUNNING = 'running',
  YOGA = 'yoga',
  CYCLING = 'cycling',
  CROSSFIT = 'crossfit',
  PILATES = 'pilates',
  DANCE = 'dance',
  SWIMMING = 'swimming',
  TENNIS = 'tennis',
  PICKLEBALL = 'pickleball',
  OTHER = 'other',
}

export enum CommunityPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INVITE_ONLY = 'invite_only',
}

@Entity('communities')
@Index(['slug'])
@Index(['location'])
export class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CommunityCategory,
  })
  category: CommunityCategory;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column({ type: 'jsonb' })
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };

  @Column({
    type: 'enum',
    enum: CommunityPrivacy,
    default: CommunityPrivacy.PUBLIC,
  })
  privacy: CommunityPrivacy;

  @Column({ default: true })
  leaderboardEnabled: boolean;

  @Column({ type: 'jsonb', nullable: true })
  leaderboardSettings: {
    metrics: string[];
    resetFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
    privacy: 'public' | 'members_only' | 'private';
    pointValues: Record<string, number>;
  };

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'jsonb', nullable: true })
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };

  @Column('uuid')
  organizerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @OneToMany(() => Event, (event) => event.community)
  events: Event[];

  @OneToMany(() => CommunityMember, (member) => member.community)
  members: CommunityMember[];

  @OneToMany(() => Membership, (membership) => membership.community)
  memberships: Membership[];

  @Column({ default: 0 })
  memberCount: number;

  @Column({ default: 0 })
  eventCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


