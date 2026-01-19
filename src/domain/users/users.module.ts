import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@domain/users/application/ports/user.repository';
import { UserRepositoryImpl } from '@domain/users/infrastructure/persistence/user.repository.impl';
import { UserRecord } from '@domain/users/infrastructure/persistence/schema/user.record';
import { CreateUserUseCase } from '@domain/users/application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '@domain/users/application/use-cases/delete-user.use-case';
import { UsersController } from '@domain/users/presenters/http/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRecord])],
  controllers: [UsersController],
  providers: [
    { provide: UserRepository, useClass: UserRepositoryImpl },
    CreateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
