import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  Index,
} from 'typeorm';
import { TaskRecord } from '@domain/tasks/infrastructure/persistence/schema/task.record';

@Entity('users')
export class UserRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  name: string;

  @ManyToMany(() => TaskRecord, (task) => task.assignees)
  tasks: TaskRecord[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
