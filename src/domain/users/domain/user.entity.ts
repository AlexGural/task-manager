import { randomUUID, UUID } from 'crypto';

export class User {
  public readonly id: UUID;
  public readonly email: string;
  public readonly name: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(params: {
    id?: UUID;
    email: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id ?? randomUUID();
    this.email = params.email;
    this.name = params.name;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
