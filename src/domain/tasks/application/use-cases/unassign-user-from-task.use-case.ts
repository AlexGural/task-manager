import { Injectable } from '@nestjs/common';
import { Task } from '@domain/tasks/domain/task.entity';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { AssignUserCommand } from '@domain/tasks/application/commands/assign-user.command';
import { EntityNotFoundException } from '@domain-exceptions/entity-not-found.exception';
import { UserNotAssignedException } from '@domain/tasks/domain/exceptions/user-not-assigned.exception';

@Injectable()
export class UnassignUserFromTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: AssignUserCommand): Promise<Task> {
    const task = await this.taskRepository.findByIdWithAssignees(command.taskId);
    if (!task) {
      throw new EntityNotFoundException('Task', command.taskId);
    }

    if (!task.hasAssignee(command.userId)) {
      throw new UserNotAssignedException(command.taskId, command.userId);
    }

    return this.taskRepository.removeAssignee(command.taskId, command.userId);
  }
}
