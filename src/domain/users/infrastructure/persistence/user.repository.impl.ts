import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { User } from '@domain/users/domain/user.entity';
import { UserRepository } from '@domain/users/application/ports/user.repository';
import { UserRecord } from '@domain/users/infrastructure/persistence/schema/user.record';
import { UserMapper } from '@domain/users/infrastructure/persistence/mappers/user.mapper';

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  constructor(
    @InjectRepository(UserRecord)
    private readonly repo: Repository<UserRecord>,
  ) {
    super();
  }

  async create(user: User): Promise<User> {
    const record = this.repo.create(UserMapper.toRecord(user));
    const saved = await this.repo.save(record);
    return UserMapper.toDomain(saved);
  }

  async findById(id: UUID): Promise<User | null> {
    const record = await this.repo.findOne({ where: { id } });
    return record ? UserMapper.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.repo.findOne({ where: { email } });
    return record ? UserMapper.toDomain(record) : null;
  }

  async delete(id: UUID): Promise<void> {
    await this.repo.delete(id);
  }
}
