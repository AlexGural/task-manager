import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '@infrastructure/filters/http-exception.filter';
import { ApiTokenGuard } from '@infrastructure/guards/api-token.guard';
import { DataSource } from 'typeorm';

export const createTestApp = async (): Promise<NestFastifyApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(new ApiTokenGuard());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return app;
};

export const cleanDatabase = async (app: INestApplication) => {
  const dataSource = app.get(DataSource);
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE`);
  }
};

export const API_TOKEN_HEADER = { 'x-token-id': 'test-token' };
