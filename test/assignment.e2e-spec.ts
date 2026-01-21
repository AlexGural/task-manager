import { NestFastifyApplication } from '@nestjs/platform-fastify';
import * as request from 'supertest';
import { createTestApp, cleanDatabase, API_TOKEN_HEADER } from './test-utils';

describe('Task Assignment (e2e)', () => {
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

  const createUser = async (email: string, name: string) => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .set(API_TOKEN_HEADER)
      .send({ email, name });
    return response.body;
  };

  const createTask = async (title: string) => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set(API_TOKEN_HEADER)
      .send({ title });
    return response.body;
  };

  describe('POST /tasks/:id/assignees', () => {
    it('should assign user to task', async () => {
      const user = await createUser('user@example.com', 'User');
      const task = await createTask('Task');

      const response = await request(app.getHttpServer())
        .post(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .send({ userId: user.id })
        .expect(201);

      expect(response.body.assigneeIds).toHaveLength(1);
      expect(response.body.assigneeIds[0]).toBe(user.id);
    });

    it('should assign multiple users to task', async () => {
      const user1 = await createUser('user1@example.com', 'User 1');
      const user2 = await createUser('user2@example.com', 'User 2');
      const task = await createTask('Task');

      await request(app.getHttpServer())
        .post(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .send({ userId: user1.id });

      const response = await request(app.getHttpServer())
        .post(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .send({ userId: user2.id })
        .expect(201);

      expect(response.body.assigneeIds).toHaveLength(2);
    });

    it('should fail for non-existent task', async () => {
      const user = await createUser('user@example.com', 'User');

      await request(app.getHttpServer())
        .post('/tasks/123e4567-e89b-12d3-a456-426614174000/assignees')
        .set(API_TOKEN_HEADER)
        .send({ userId: user.id })
        .expect(404);
    });

    it('should fail for non-existent user', async () => {
      const task = await createTask('Task');

      await request(app.getHttpServer())
        .post(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .send({ userId: '123e4567-e89b-12d3-a456-426614174000' })
        .expect(404);
    });

    it('should fail with 409 when user is already assigned', async () => {
      const user = await createUser('user@example.com', 'User');
      const task = await createTask('Task');

      // First assignment
      await request(app.getHttpServer())
        .post(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .send({ userId: user.id })
        .expect(201);

      // Second assignment - should fail
      const response = await request(app.getHttpServer())
        .post(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .send({ userId: user.id })
        .expect(409);

      expect(response.body.code).toBe('USER_ALREADY_ASSIGNED');
    });
  });

  describe('GET /tasks/:id/assignees', () => {
    it('should return task assignee IDs', async () => {
      const user = await createUser('user@example.com', 'User');
      const task = await createTask('Task');

      await request(app.getHttpServer())
        .post(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .send({ userId: user.id });

      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toBe(user.id);
    });

    it('should return empty array for task without assignees', async () => {
      const task = await createTask('Task');

      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('DELETE /tasks/:id/assignees/:userId', () => {
    it('should unassign user from task', async () => {
      const user = await createUser('user@example.com', 'User');
      const task = await createTask('Task');

      await request(app.getHttpServer())
        .post(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .send({ userId: user.id });

      const response = await request(app.getHttpServer())
        .delete(`/tasks/${task.id}/assignees/${user.id}`)
        .set(API_TOKEN_HEADER)
        .expect(200);

      expect(response.body.assigneeIds).toHaveLength(0);
    });

    it('should fail for non-existent task', async () => {
      await request(app.getHttpServer())
        .delete('/tasks/123e4567-e89b-12d3-a456-426614174000/assignees/123e4567-e89b-12d3-a456-426614174001')
        .set(API_TOKEN_HEADER)
        .expect(404);
    });

    it('should fail with 422 when user is not assigned', async () => {
      const user = await createUser('user@example.com', 'User');
      const task = await createTask('Task');

      const response = await request(app.getHttpServer())
        .delete(`/tasks/${task.id}/assignees/${user.id}`)
        .set(API_TOKEN_HEADER)
        .expect(422);

      expect(response.body.code).toBe('USER_NOT_ASSIGNED');
    });
  });

  describe('Cascade delete', () => {
    it('should remove assignments when user is deleted', async () => {
      const user = await createUser('user@example.com', 'User');
      const task = await createTask('Task');

      await request(app.getHttpServer())
        .post(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .send({ userId: user.id });

      // Delete user
      await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .set(API_TOKEN_HEADER)
        .expect(204);

      // Check task assignees
      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    it('should remove assignments when task is deleted', async () => {
      const user = await createUser('user@example.com', 'User');
      const task = await createTask('Task');

      await request(app.getHttpServer())
        .post(`/tasks/${task.id}/assignees`)
        .set(API_TOKEN_HEADER)
        .send({ userId: user.id });

      // Delete task
      await request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .set(API_TOKEN_HEADER)
        .expect(204);

      // Task should be gone
      await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .set(API_TOKEN_HEADER)
        .expect(404);
    });
  });
});
