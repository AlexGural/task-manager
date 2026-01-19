import { UUID } from 'crypto';

export interface AssignUserCommand {
  taskId: UUID;
  userId: UUID;
}
