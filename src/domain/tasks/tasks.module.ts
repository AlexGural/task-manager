import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from '@domain/tasks/application/ports/task.repository';
import { TaskRepositoryImpl } from '@domain/tasks/infrastructure/persistence/task.repository.impl';
import { TaskRecord } from '@domain/tasks/infrastructure/persistence/schema/task.record';
import { CreateTaskUseCase } from '@domain/tasks/application/use-cases/create-task.use-case';
import { FindAllTasksUseCase } from '@domain/tasks/application/use-cases/find-all-tasks.use-case';
import { FindTaskUseCase } from '@domain/tasks/application/use-cases/find-task.use-case';
import { UpdateTaskUseCase } from '@domain/tasks/application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '@domain/tasks/application/use-cases/delete-task.use-case';
import { AssignUserToTaskUseCase } from '@domain/tasks/application/use-cases/assign-user-to-task.use-case';
import { UnassignUserFromTaskUseCase } from '@domain/tasks/application/use-cases/unassign-user-from-task.use-case';
import { GetTaskAssigneesUseCase } from '@domain/tasks/application/use-cases/get-task-assignees.use-case';
import { TasksController } from '@domain/tasks/presenters/http/tasks.controller';
import { UsersModule } from '@domain/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRecord]),
    UsersModule,
  ],
  controllers: [TasksController],
  providers: [
    { provide: TaskRepository, useClass: TaskRepositoryImpl },
    CreateTaskUseCase,
    FindAllTasksUseCase,
    FindTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    AssignUserToTaskUseCase,
    UnassignUserFromTaskUseCase,
    GetTaskAssigneesUseCase,
  ],
  exports: [TaskRepository],
})
export class TasksModule {}
