import { UUID } from 'crypto';
import { Task } from '@domain/tasks/domain/task.entity';
import { TaskStatus } from '@domain/tasks/domain/task-status';
import { TaskRecord } from '@domain/tasks/infrastructure/persistence/schema/task.record';

export class TaskMapper {
  static toDomain(record: TaskRecord): Task {
    return new Task({
      id: record.id as UUID,
      title: record.title,
      description: record.description,
      status: record.status as TaskStatus,
      assigneeIds: record.assignees?.map((u) => u.id as UUID) ?? [],
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toRecord(task: Task): Partial<TaskRecord> {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
    };
  }
}
