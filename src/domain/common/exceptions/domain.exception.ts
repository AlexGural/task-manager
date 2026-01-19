import { DomainErrorCode } from '@domain-exceptions/domain-error-code';

export abstract class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: DomainErrorCode,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
