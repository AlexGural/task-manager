import { IsString, IsOptional, IsIn, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskStatusMap } from '@domain/tasks/domain/task-status';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Buy groceries', description: 'Task title', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 'Milk, bread, eggs', description: 'Task description' })
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({
    enum: Object.values(TaskStatusMap),
    example: TaskStatusMap.inProgress,
    description: 'Task status',
  })
  @IsIn(Object.values(TaskStatusMap))
  @IsOptional()
  status?: TaskStatus;
}
