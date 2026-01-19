import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { UserRepository } from '@domain/users/application/ports/user.repository';
import { EntityNotFoundException } from '@domain-exceptions/entity-not-found.exception';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: UUID): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new EntityNotFoundException('User', id);
    }

    await this.userRepository.delete(id);
  }
}
