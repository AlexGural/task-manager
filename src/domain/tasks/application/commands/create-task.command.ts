import { TaskStatus } from '@domain/tasks/domain/task-status';

export interface CreateTaskCommand {
  title: string;
  description?: string;
  status?: TaskStatus;
}
