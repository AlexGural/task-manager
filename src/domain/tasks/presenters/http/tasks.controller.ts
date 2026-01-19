import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { CreateTaskUseCase } from '@domain/tasks/application/use-cases/create-task.use-case';
import { FindAllTasksUseCase } from '@domain/tasks/application/use-cases/find-all-tasks.use-case';
import { FindTaskUseCase } from '@domain/tasks/application/use-cases/find-task.use-case';
import { UpdateTaskUseCase } from '@domain/tasks/application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '@domain/tasks/application/use-cases/delete-task.use-case';
import { AssignUserToTaskUseCase } from '@domain/tasks/application/use-cases/assign-user-to-task.use-case';
import { UnassignUserFromTaskUseCase } from '@domain/tasks/application/use-cases/unassign-user-from-task.use-case';
import { GetTaskAssigneesUseCase } from '@domain/tasks/application/use-cases/get-task-assignees.use-case';
import { CreateTaskDto } from '@domain/tasks/presenters/http/dto/create-task.dto';
import { UpdateTaskDto } from '@domain/tasks/presenters/http/dto/update-task.dto';
import { AssignUserDto } from '@domain/tasks/presenters/http/dto/assign-user.dto';
import { TaskResponseDto } from '@domain/tasks/presenters/http/dto/task.response.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly findAllTasksUseCase: FindAllTasksUseCase,
    private readonly findTaskUseCase: FindTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly assignUserToTaskUseCase: AssignUserToTaskUseCase,
    private readonly unassignUserFromTaskUseCase: UnassignUserFromTaskUseCase,
    private readonly getTaskAssigneesUseCase: GetTaskAssigneesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created', type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() dto: CreateTaskDto) {
    return this.createTaskUseCase.execute({
      title: dto.title,
      description: dto.description,
      status: dto.status,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'List of tasks', type: [TaskResponseDto] })
  findAll() {
    return this.findAllTasksUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task found', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.findTaskUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task updated', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id', ParseUUIDPipe) id: UUID, @Body() dto: UpdateTaskDto) {
    return this.updateTaskUseCase.execute(id, {
      title: dto.title,
      description: dto.description,
      status: dto.status,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 204, description: 'Task deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.deleteTaskUseCase.execute(id);
  }

  @Post(':id/assignees')
  @ApiOperation({ summary: 'Assign user to task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 201, description: 'User assigned', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task or user not found' })
  assignUser(@Param('id', ParseUUIDPipe) id: UUID, @Body() dto: AssignUserDto) {
    return this.assignUserToTaskUseCase.execute({
      taskId: id,
      userId: dto.userId as UUID,
    });
  }

  @Delete(':id/assignees/:userId')
  @ApiOperation({ summary: 'Unassign user from task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User unassigned', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  unassignUser(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Param('userId', ParseUUIDPipe) userId: UUID,
  ) {
    return this.unassignUserFromTaskUseCase.execute({ taskId: id, userId });
  }

  @Get(':id/assignees')
  @ApiOperation({ summary: 'Get task assignees' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'List of assignee IDs', type: [String] })
  @ApiResponse({ status: 404, description: 'Task not found' })
  getAssignees(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.getTaskAssigneesUseCase.execute(id);
  }
}
