export const TaskStatusMap = {
  todo: 'todo',
  inProgress: 'in_progress',
  done: 'done',
} as const;

export type TaskStatus = (typeof TaskStatusMap)[keyof typeof TaskStatusMap];
