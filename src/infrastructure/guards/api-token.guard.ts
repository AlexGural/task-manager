import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

const API_TOKEN_HEADER = 'x-token-id';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = request.headers[API_TOKEN_HEADER];

    if (!token) {
      throw new UnauthorizedException(
        `Missing required header: ${API_TOKEN_HEADER}`,
      );
    }

    // TODO: Add actual token validation logic here, just check if header exists

    return true;
  }
}
