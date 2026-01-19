import { NestFastifyApplication } from '@nestjs/platform-fastify';
import * as request from 'supertest';
import { createTestApp, cleanDatabase, API_TOKEN_HEADER } from './test-utils';
import { TaskStatusMap } from '@domain/tasks/domain/task-status';

describe('Tasks (e2e)', () => {
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

  describe('POST /tasks', () => {
    it('should create a task', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set(API_TOKEN_HEADER)
        .send({ title: 'Test Task', description: 'Test Description' })
        .expect(201);

      expect(response.body).toMatchObject({
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatusMap.todo,
      });
      expect(response.body.id).toBeDefined();
    });

    it('should create a task with custom status', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set(API_TOKEN_HEADER)
        .send({ 
          title: 'In Progress Task', 
          status: TaskStatusMap.inProgress,
        })
        .expect(201);

      expect(response.body.status).toBe(TaskStatusMap.inProgress);
    });

    it('should fail without title', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .set(API_TOKEN_HEADER)
        .send({ description: 'No title' })
        .expect(400);
    });

    it('should fail without auth header', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Test' })
        .expect(401);
    });
  });

  describe('GET /tasks', () => {
    it('should return empty array when no tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set(API_TOKEN_HEADER)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all tasks', async () => {
      // Create tasks
      await request(app.getHttpServer())
        .post('/tasks')
        .set(API_TOKEN_HEADER)
        .send({ title: 'Task 1' });

      await request(app.getHttpServer())
        .post('/tasks')
        .set(API_TOKEN_HEADER)
        .send({ title: 'Task 2' });

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set(API_TOKEN_HEADER)
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return task by id', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .set(API_TOKEN_HEADER)
        .send({ title: 'Find Me' });

      const response = await request(app.getHttpServer())
        .get(`/tasks/${createResponse.body.id}`)
        .set(API_TOKEN_HEADER)
        .expect(200);

      expect(response.body.title).toBe('Find Me');
    });

    it('should return 404 for non-existent task', async () => {
      await request(app.getHttpServer())
        .get('/tasks/123e4567-e89b-12d3-a456-426614174000')
        .set(API_TOKEN_HEADER)
        .expect(404);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update task', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .set(API_TOKEN_HEADER)
        .send({ title: 'Original' });

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${createResponse.body.id}`)
        .set(API_TOKEN_HEADER)
        .send({ title: 'Updated', status: TaskStatusMap.done })
        .expect(200);

      expect(response.body.title).toBe('Updated');
      expect(response.body.status).toBe(TaskStatusMap.done);
    });

    it('should return 404 for non-existent task', async () => {
      await request(app.getHttpServer())
        .patch('/tasks/123e4567-e89b-12d3-a456-426614174000')
        .set(API_TOKEN_HEADER)
        .send({ title: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete task', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .set(API_TOKEN_HEADER)
        .send({ title: 'To Delete' });

      await request(app.getHttpServer())
        .delete(`/tasks/${createResponse.body.id}`)
        .set(API_TOKEN_HEADER)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/tasks/${createResponse.body.id}`)
        .set(API_TOKEN_HEADER)
        .expect(404);
    });

    it('should return 404 for non-existent task', async () => {
      await request(app.getHttpServer())
        .delete('/tasks/123e4567-e89b-12d3-a456-426614174000')
        .set(API_TOKEN_HEADER)
        .expect(404);
    });
  });
});
