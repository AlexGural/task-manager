import { DomainException } from '@domain-exceptions/domain.exception';
import { DomainErrorCodeMap } from '@domain-exceptions/domain-error-code';

export class UserNotAssignedException extends DomainException {
  constructor(taskId: string, userId: string) {
    super(
      `User "${userId}" is not assigned to task "${taskId}"`,
      DomainErrorCodeMap.userNotAssigned,
    );
  }
}
