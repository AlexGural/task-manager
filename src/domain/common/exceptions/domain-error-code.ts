export const DomainErrorCodeMap = {
  entityNotFound: 'ENTITY_NOT_FOUND',
  entityAlreadyExists: 'ENTITY_ALREADY_EXISTS',
} as const;

export type DomainErrorCode =
  (typeof DomainErrorCodeMap)[keyof typeof DomainErrorCodeMap];
