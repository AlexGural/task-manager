import { NestFastifyApplication } from '@nestjs/platform-fastify';
import * as request from 'supertest';
import { createTestApp, cleanDatabase, API_TOKEN_HEADER } from './test-utils';

describe('Users (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await cleanDatabase(app);
  });

  describe('POST /users', () => {
    it('should create a user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set(API_TOKEN_HEADER)
        .send({ email: 'test@example.com', name: 'Test User' })
        .expect(201);

      expect(response.body).toMatchObject({
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(response.body.id).toBeDefined();
    });

    it('should fail with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set(API_TOKEN_HEADER)
        .send({ email: 'duplicate@example.com', name: 'User 1' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/users')
        .set(API_TOKEN_HEADER)
        .send({ email: 'duplicate@example.com', name: 'User 2' })
        .expect(409);
    });

    it('should fail with invalid email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set(API_TOKEN_HEADER)
        .send({ email: 'invalid-email', name: 'User' })
        .expect(400);
    });

    it('should fail without required fields', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set(API_TOKEN_HEADER)
        .send({})
        .expect(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .set(API_TOKEN_HEADER)
        .send({ email: 'delete@example.com', name: 'To Delete' });

      await request(app.getHttpServer())
        .delete(`/users/${createResponse.body.id}`)
        .set(API_TOKEN_HEADER)
        .expect(204);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .delete('/users/123e4567-e89b-12d3-a456-426614174000')
        .set(API_TOKEN_HEADER)
        .expect(404);
    });
  });
});
