import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from '@infrastructure/swagger';
import { HttpExceptionFilter } from '@infrastructure/filters/http-exception.filter';
import { ApiTokenGuard } from '@infrastructure/guards/api-token.guard';
import { EnvVariables } from '@config/env.validation';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService<EnvVariables>);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(new ApiTokenGuard());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  setupSwagger(app);

  const port = configService.get('PORT', { infer: true });

  await app.listen(port, '0.0.0.0');

  logger.log(`http://localhost:${port}`);
  logger.log(`Swagger: http://localhost:${port}/api/doc`);
}
bootstrap();
