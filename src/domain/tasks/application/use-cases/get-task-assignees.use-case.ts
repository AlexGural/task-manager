import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { EntityNotFoundException } from '@domain-exceptions/entity-not-found.exception';

@Injectable()
export class GetTaskAssigneesUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: UUID): Promise<UUID[]> {
    const task = await this.taskRepository.findByIdWithAssignees(taskId);
    if (!task) {
      throw new EntityNotFoundException('Task', taskId);
    }

    return task.assigneeIds;
  }
}
