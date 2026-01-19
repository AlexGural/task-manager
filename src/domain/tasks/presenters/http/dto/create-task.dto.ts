import { IsString, IsNotEmpty, IsOptional, IsIn, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskStatusMap } from '@domain/tasks/domain/task-status';

export class CreateTaskDto {
  @ApiProperty({ example: 'Buy groceries', description: 'Task title', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Milk, bread, eggs', description: 'Task description' })
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({
    enum: Object.values(TaskStatusMap),
    example: TaskStatusMap.todo,
    description: 'Task status',
  })
  @IsIn(Object.values(TaskStatusMap))
  @IsOptional()
  status?: TaskStatus;
}
