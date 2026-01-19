import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DomainException } from '@domain-exceptions/domain.exception';
import { EntityNotFoundException } from '@domain-exceptions/entity-not-found.exception';
import { EntityAlreadyExistsException } from '@domain-exceptions/entity-already-exists.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const { status, message, errors, code } = this.mapException(exception);

    this.logger.error(
      `HTTP Exception: ${JSON.stringify({ status, message, errors, code })}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).send({
      statusCode: status,
      code,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  private mapException(exception: unknown): {
    status: number;
    message: string;
    errors: string[];
    code?: string;
  } {
    // Domain exceptions
    if (exception instanceof EntityNotFoundException) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Not Found',
        errors: [exception.message],
        code: exception.code,
      };
    }

    if (exception instanceof EntityAlreadyExistsException) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'Conflict',
        errors: [exception.message],
        code: exception.code,
      };
    }

    if (exception instanceof DomainException) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Domain Error',
        errors: [exception.message],
        code: exception.code,
      };
    }

    // NestJS HTTP exceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const formatted = this.formatHttpResponse(exceptionResponse);
      return {
        status,
        message: formatted.message,
        errors: formatted.errors,
      };
    }

    // Unknown errors
    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        errors: [exception.message],
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
      errors: [],
    };
  }

  private formatHttpResponse(responseBody: string | object): {
    message: string;
    errors: string[];
  } {
    if (typeof responseBody === 'string') {
      return { message: responseBody, errors: [] };
    }

    const body = responseBody as Record<string, unknown>;
    const msg = (body.error as string) || (body.message as string) || 'Error';

    if (Array.isArray(body.message)) {
      return {
        message: msg,
        errors: body.message as string[],
      };
    }

    if (typeof body.message === 'string' && body.message !== msg) {
      return { message: msg, errors: [body.message] };
    }

    return { message: msg, errors: [] };
  }
}
