import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user.created' })
  @Column({ type: 'text' })
  event: string;

  @ApiProperty({ example: { userId: 123, name: 'John Doe' } })
  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
