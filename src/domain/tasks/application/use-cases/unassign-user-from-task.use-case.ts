import { Injectable } from '@nestjs/common';
import { Task } from '@domain/tasks/domain/task.entity';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { AssignUserCommand } from '@domain/tasks/application/commands/assign-user.command';
import { EntityNotFoundException } from '@domain-exceptions/entity-not-found.exception';

@Injectable()
export class UnassignUserFromTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: AssignUserCommand): Promise<Task> {
    const task = await this.taskRepository.findByIdWithAssignees(command.taskId);
    if (!task) {
      throw new EntityNotFoundException('Task', command.taskId);
    }

    return this.taskRepository.unassignUser(command.taskId, command.userId);
  }
}
