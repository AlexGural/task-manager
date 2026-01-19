import { UUID } from 'crypto';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { Task } from '@domain/tasks/domain/task.entity';
import { TaskStatusMap } from '@domain/tasks/domain/task-status';
import { EntityNotFoundException } from '@domain-exceptions/entity-not-found.exception';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
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

    useCase = new DeleteTaskUseCase(taskRepository);
  });

  it('should delete task successfully', async () => {
    const taskId = '123e4567-e89b-12d3-a456-426614174000' as UUID;
    const task = new Task({
      id: taskId,
      title: 'Task to delete',
      description: 'Will be deleted',
      status: TaskStatusMap.todo,
    });

    taskRepository.findById.mockResolvedValue(task);
    taskRepository.delete.mockResolvedValue(undefined);

    await useCase.execute(taskId);

    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
    expect(taskRepository.delete).toHaveBeenCalledWith(taskId);
  });

  it('should throw EntityNotFoundException when task not found', async () => {
    const taskId = '123e4567-e89b-12d3-a456-426614174000' as UUID;

    taskRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(taskId)).rejects.toThrow(EntityNotFoundException);
    expect(taskRepository.delete).not.toHaveBeenCalled();
  });
});
