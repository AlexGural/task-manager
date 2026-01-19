import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { CreateUserUseCase } from '@domain/users/application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '@domain/users/application/use-cases/delete-user.use-case';
import { CreateUserDto } from '@domain/users/presenters/http/dto/create-user.dto';
import { UserResponseDto } from '@domain/users/presenters/http/dto/user.response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute({
      email: dto.email,
      name: dto.name,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.deleteUserUseCase.execute(id);
  }
}
