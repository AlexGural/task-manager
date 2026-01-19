import { UUID } from 'crypto';
import { AssignUserToTaskUseCase } from './assign-user-to-task.use-case';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { UserRepository } from '@domain/users/application/ports/user.repository';
import { Task } from '@domain/tasks/domain/task.entity';
import { User } from '@domain/users/domain/user.entity';
import { TaskStatusMap } from '@domain/tasks/domain/task-status';
import { EntityNotFoundException } from '@domain-exceptions/entity-not-found.exception';

describe('AssignUserToTaskUseCase', () => {
  let useCase: AssignUserToTaskUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;
  let userRepository: jest.Mocked<UserRepository>;

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

    userRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new AssignUserToTaskUseCase(taskRepository, userRepository);
  });

  it('should assign user to task successfully', async () => {
    const taskId = '123e4567-e89b-12d3-a456-426614174000' as UUID;
    const userId = '223e4567-e89b-12d3-a456-426614174000' as UUID;
    
    const task = new Task({
      id: taskId,
      title: 'Task',
      description: 'Description',
      status: TaskStatusMap.todo,
    });
    
    const user: User = {
      id: userId,
      email: 'user@example.com',
      name: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const taskWithAssignee = new Task({
      id: taskId,
      title: 'Task',
      description: 'Description',
      status: TaskStatusMap.todo,
      assigneeIds: [userId],
    });

    taskRepository.findById.mockResolvedValue(task);
    userRepository.findById.mockResolvedValue(user);
    taskRepository.assignUser.mockResolvedValue(taskWithAssignee);

    const result = await useCase.execute({ taskId, userId });

    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(taskRepository.assignUser).toHaveBeenCalledWith(taskId, userId);
    expect(result.assigneeIds).toContain(userId);
  });

  it('should throw EntityNotFoundException when task not found', async () => {
    const taskId = '123e4567-e89b-12d3-a456-426614174000' as UUID;
    const userId = '223e4567-e89b-12d3-a456-426614174000' as UUID;

    taskRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ taskId, userId })).rejects.toThrow(EntityNotFoundException);
    await expect(useCase.execute({ taskId, userId })).rejects.toThrow(`Task with id: "${taskId}" not found`);
  });

  it('should throw EntityNotFoundException when user not found', async () => {
    const taskId = '123e4567-e89b-12d3-a456-426614174000' as UUID;
    const userId = '223e4567-e89b-12d3-a456-426614174000' as UUID;
    
    const task = new Task({
      id: taskId,
      title: 'Task',
      description: 'Description',
      status: TaskStatusMap.todo,
    });

    taskRepository.findById.mockResolvedValue(task);
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ taskId, userId })).rejects.toThrow(EntityNotFoundException);
    await expect(useCase.execute({ taskId, userId })).rejects.toThrow(`User with id: "${userId}" not found`);
  });
});
