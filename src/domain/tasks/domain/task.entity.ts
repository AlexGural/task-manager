import { randomUUID, UUID } from 'crypto';
import { TaskStatus, TaskStatusMap } from '@domain/tasks/domain/task-status';

export class Task {
  public readonly id: UUID;
  public readonly title: string;
  public readonly description: string | null;
  public readonly status: TaskStatus;
  public readonly assigneeIds: UUID[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(params: {
    id?: UUID;
    title: string;
    description?: string | null;
    status?: TaskStatus;
    assigneeIds?: UUID[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id ?? randomUUID();
    this.title = params.title;
    this.description = params.description ?? null;
    this.status = params.status ?? TaskStatusMap.todo;
    this.assigneeIds = params.assigneeIds ?? [];
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
