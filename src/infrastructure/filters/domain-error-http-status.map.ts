import { HttpStatus } from '@nestjs/common';
import { DomainErrorCode, DomainErrorCodeMap } from '@domain-exceptions/domain-error-code';

export const DOMAIN_ERROR_HTTP_STATUS_MAP: Record<DomainErrorCode, HttpStatus> = {
  [DomainErrorCodeMap.entityNotFound]: HttpStatus.NOT_FOUND,
  [DomainErrorCodeMap.entityAlreadyExists]: HttpStatus.CONFLICT,
  [DomainErrorCodeMap.userAlreadyAssigned]: HttpStatus.CONFLICT,
  [DomainErrorCodeMap.userNotAssigned]: HttpStatus.UNPROCESSABLE_ENTITY,
};
