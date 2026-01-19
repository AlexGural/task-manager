import { Injectable } from '@nestjs/common';
import { User } from '@domain/users/domain/user.entity';
import { UserRepository } from '@domain/users/application/ports/user.repository';
import { CreateUserCommand } from '@domain/users/application/commands/create-user.command';
import { EntityAlreadyExistsException } from '@domain-exceptions/entity-already-exists.exception';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new EntityAlreadyExistsException('User', 'email', command.email);
    }

    const user = new User({
      email: command.email,
      name: command.name,
    });

    return this.userRepository.create(user);
  }
}
