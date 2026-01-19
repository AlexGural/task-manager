import { DomainException } from '@domain-exceptions/domain.exception';
import { DomainErrorCodeMap } from '@domain-exceptions/domain-error-code';

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id: string) {
    super(
      `${entityName} with id: "${id}" not found`,
      DomainErrorCodeMap.entityNotFound,
    );
  }
}
