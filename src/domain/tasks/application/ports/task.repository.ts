import { UUID } from 'crypto';
import { Task } from '@domain/tasks/domain/task.entity';

export abstract class TaskRepository {
  abstract create(task: Task): Promise<Task>;
  abstract findAll(): Promise<Task[]>;
  abstract findById(id: UUID): Promise<Task | null>;
  abstract findByIdWithAssignees(id: UUID): Promise<Task | null>;
  abstract update(task: Task): Promise<Task>;
  abstract delete(id: UUID): Promise<void>;
  abstract addAssignee(taskId: UUID, userId: UUID): Promise<Task>;
  abstract removeAssignee(taskId: UUID, userId: UUID): Promise<Task>;
}
