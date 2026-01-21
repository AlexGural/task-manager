import { DomainException } from '@domain-exceptions/domain.exception';
import { DomainErrorCodeMap } from '@domain-exceptions/domain-error-code';

export class UserAlreadyAssignedException extends DomainException {
  constructor(taskId: string, userId: string) {
    super(
      `User "${userId}" is already assigned to task "${taskId}"`,
      DomainErrorCodeMap.userAlreadyAssigned,
    );
  }
}
