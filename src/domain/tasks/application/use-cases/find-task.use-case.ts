import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Task } from '@domain/tasks/domain/task.entity';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { EntityNotFoundException } from '@domain-exceptions/entity-not-found.exception';

@Injectable()
export class FindTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: UUID): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new EntityNotFoundException('Task', id);
    }

    return task;
  }
}
