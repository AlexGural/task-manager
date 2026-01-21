import { Injectable } from '@nestjs/common';
import { Task } from '@domain/tasks/domain/task.entity';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { UserRepository } from '@domain/users/application/ports/user.repository';
import { AssignUserCommand } from '@domain/tasks/application/commands/assign-user.command';
import { EntityNotFoundException } from '@domain-exceptions/entity-not-found.exception';
import { UserAlreadyAssignedException } from '@domain/tasks/domain/exceptions/user-already-assigned.exception';

@Injectable()
export class AssignUserToTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: AssignUserCommand): Promise<Task> {
    const task = await this.taskRepository.findByIdWithAssignees(command.taskId);
    if (!task) {
      throw new EntityNotFoundException('Task', command.taskId);
    }

    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new EntityNotFoundException('User', command.userId);
    }

    if (task.hasAssignee(command.userId)) {
      throw new UserAlreadyAssignedException(command.taskId, command.userId);
    }

    return this.taskRepository.addAssignee(command.taskId, command.userId);
  }
}
