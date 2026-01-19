import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskStatusMap } from '@domain/tasks/domain/task-status';

export class TaskResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Buy groceries' })
  title: string;

  @ApiProperty({ example: 'Milk, bread, eggs', nullable: true })
  description: string | null;

  @ApiProperty({ enum: Object.values(TaskStatusMap), example: TaskStatusMap.todo })
  status: TaskStatus;

  @ApiProperty({
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'Assigned user IDs',
  })
  assigneeIds: string[];

  @ApiProperty({ example: '2024-01-19T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-19T12:00:00.000Z' })
  updatedAt: Date;
}
