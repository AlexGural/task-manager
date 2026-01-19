import { TaskStatus } from '@domain/tasks/domain/task-status';

export interface UpdateTaskCommand {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
