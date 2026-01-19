import { Injectable } from '@nestjs/common';
import { Task } from '@domain/tasks/domain/task.entity';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { CreateTaskCommand } from '@domain/tasks/application/commands/create-task.command';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    const task = new Task({
      title: command.title,
      description: command.description,
      status: command.status,
    });

    return this.taskRepository.create(task);
  }
}
