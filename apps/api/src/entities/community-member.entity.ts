import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Community } from './community.entity';
import { User } from './user.entity';

export enum MemberRole {
  MEMBER = 'member',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

@Entity('community_members')
@Index(['communityId', 'userId'], { unique: true })
export class CommunityMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  communityId: string;

  @ManyToOne(() => Community)
  @JoinColumn({ name: 'communityId' })
  community: Community;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: MemberRole,
    default: MemberRole.MEMBER,
  })
  role: MemberRole;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0 })
  eventsAttended: number;

  @Column({ default: 0 })
  checkIns: number;

  @Column({ type: 'jsonb', nullable: true })
  activityMetrics: {
    totalDistance?: number;
    totalHours?: number;
    longestStreak?: number;
    currentStreak?: number;
  };

  @CreateDateColumn()
  joinedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


