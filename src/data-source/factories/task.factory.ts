import { TaskRecord } from '@domain/tasks/infrastructure/persistence/schema/task.record';
import { TaskStatus, TaskStatusMap } from '@domain/tasks/domain/task-status';

export interface CreateTaskFactoryParams {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

let taskCounter = 0;

export const createTaskFactory = (params: CreateTaskFactoryParams = {}): Partial<TaskRecord> => {
  taskCounter++;
  return {
    title: params.title ?? `Task ${taskCounter}`,
    description: params.description ?? `Description for task ${taskCounter}`,
    status: params.status ?? TaskStatusMap.todo,
  };
};

export const resetTaskFactory = () => {
  taskCounter = 0;
};
