import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Task } from '@domain/tasks/domain/task.entity';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { UpdateTaskCommand } from '@domain/tasks/application/commands/update-task.command';
import { EntityNotFoundException } from '@domain-exceptions/entity-not-found.exception';

@Injectable()
export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: UUID, command: UpdateTaskCommand): Promise<Task> {
    const existingTask = await this.taskRepository.findById(id);

    if (!existingTask) {
      throw new EntityNotFoundException('Task', id);
    }

    const updatedTask = new Task({
      ...existingTask,
      ...command,
      updatedAt: new Date(),
    });

    return this.taskRepository.update(updatedTask);
  }
}
