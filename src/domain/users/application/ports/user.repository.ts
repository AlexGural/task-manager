import { UUID } from 'crypto';
import { User } from '@domain/users/domain/user.entity';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract findById(id: UUID): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract delete(id: UUID): Promise<void>;
}
