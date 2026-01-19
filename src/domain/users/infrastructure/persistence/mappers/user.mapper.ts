import { UUID } from 'crypto';
import { User } from '@domain/users/domain/user.entity';
import { UserRecord } from '@domain/users/infrastructure/persistence/schema/user.record';

export class UserMapper {
  static toDomain(record: UserRecord): User {
    return new User({
      id: record.id as UUID,
      email: record.email,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toRecord(user: User): Partial<UserRecord> {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
