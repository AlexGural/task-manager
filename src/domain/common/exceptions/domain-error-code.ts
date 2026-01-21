export const DomainErrorCodeMap = {
  entityNotFound: 'ENTITY_NOT_FOUND',
  entityAlreadyExists: 'ENTITY_ALREADY_EXISTS',
  userAlreadyAssigned: 'USER_ALREADY_ASSIGNED',
  userNotAssigned: 'USER_NOT_ASSIGNED',
} as const;

export type DomainErrorCode =
  (typeof DomainErrorCodeMap)[keyof typeof DomainErrorCodeMap];
