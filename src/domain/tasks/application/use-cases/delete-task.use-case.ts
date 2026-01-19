import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { EntityNotFoundException } from '@domain-exceptions/entity-not-found.exception';

@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: UUID): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new EntityNotFoundException('Task', id);
    }

    await this.taskRepository.delete(id);
  }
}
