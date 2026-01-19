import { UserRecord } from '@domain/users/infrastructure/persistence/schema/user.record';

export interface CreateUserFactoryParams {
  email?: string;
  name?: string;
}

let userCounter = 0;

export const createUserFactory = (params: CreateUserFactoryParams = {}): Partial<UserRecord> => {
  userCounter++;
  return {
    email: params.email ?? `user${userCounter}@example.com`,
    name: params.name ?? `User ${userCounter}`,
  };
};

export const resetUserFactory = () => {
  userCounter = 0;
};
