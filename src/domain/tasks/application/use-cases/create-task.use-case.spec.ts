import { UUID } from 'crypto';
import { CreateTaskUseCase } from './create-task.use-case';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { Task } from '@domain/tasks/domain/task.entity';
import { TaskStatusMap } from '@domain/tasks/domain/task-status';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    taskRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByIdWithAssignees: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      assignUser: jest.fn(),
      unassignUser: jest.fn(),
    } as jest.Mocked<TaskRepository>;

    useCase = new CreateTaskUseCase(taskRepository);
  });

  it('should create a task with default status', async () => {
    const command = { title: 'New Task', description: 'Task description' };
    const expectedTask = new Task({
      id: '123e4567-e89b-12d3-a456-426614174000' as UUID,
      title: 'New Task',
      description: 'Task description',
      status: TaskStatusMap.todo,
    });

    taskRepository.create.mockResolvedValue(expectedTask);

    const result = await useCase.execute(command);

    expect(taskRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Task',
        description: 'Task description',
        status: TaskStatusMap.todo,
      }),
    );
    expect(result).toEqual(expectedTask);
  });

  it('should create a task with custom status', async () => {
    const command = { 
      title: 'In Progress Task', 
      description: 'Already started',
      status: TaskStatusMap.inProgress,
    };
    const expectedTask = new Task({
      id: '123e4567-e89b-12d3-a456-426614174000' as UUID,
      ...command,
    });

    taskRepository.create.mockResolvedValue(expectedTask);

    const result = await useCase.execute(command);

    expect(taskRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ status: TaskStatusMap.inProgress }),
    );
    expect(result.status).toBe(TaskStatusMap.inProgress);
  });

  it('should create a task without description', async () => {
    const command = { title: 'Simple Task' };
    const expectedTask = new Task({
      id: '123e4567-e89b-12d3-a456-426614174000' as UUID,
      title: 'Simple Task',
    });

    taskRepository.create.mockResolvedValue(expectedTask);

    const result = await useCase.execute(command);

    expect(result.title).toBe('Simple Task');
  });
});
