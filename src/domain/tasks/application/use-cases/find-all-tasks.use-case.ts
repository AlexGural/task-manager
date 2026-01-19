import { Injectable } from '@nestjs/common';
import { Task } from '@domain/tasks/domain/task.entity';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';

@Injectable()
export class FindAllTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }
}
