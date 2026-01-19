import { DomainException } from '@domain-exceptions/domain.exception';
import { DomainErrorCodeMap } from '@domain-exceptions/domain-error-code';

export class EntityAlreadyExistsException extends DomainException {
  constructor(entityName: string, field: string, value: string) {
    super(
      `${entityName} with ${field}: "${value}" already exists`,
      DomainErrorCodeMap.entityAlreadyExists,
    );
  }
}
