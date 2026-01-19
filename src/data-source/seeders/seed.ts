import { DataSource } from 'typeorm';
import { dataSourceOptions } from '@data-source/datasource';
import { UserRecord } from '@domain/users/infrastructure/persistence/schema/user.record';
import { TaskRecord } from '@domain/tasks/infrastructure/persistence/schema/task.record';
import { createUserFactory } from '@data-source/factories/user.factory';
import { createTaskFactory } from '@data-source/factories/task.factory';
import { TaskStatusMap } from '@domain/tasks/domain/task-status';

const seed = async () => {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  console.log('Seeding database...');

  const userRepo = dataSource.getRepository(UserRecord);
  const taskRepo = dataSource.getRepository(TaskRecord);

  // Create users
  const users = await userRepo.save([
    userRepo.create(createUserFactory({ email: 'john@example.com', name: 'John Doe' })),
    userRepo.create(createUserFactory({ email: 'jane@example.com', name: 'Jane Smith' })),
    userRepo.create(createUserFactory({ email: 'bob@example.com', name: 'Bob Wilson' })),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create tasks
  const tasks = await taskRepo.save([
    taskRepo.create(createTaskFactory({ 
      title: 'Setup project', 
      description: 'Initialize NestJS project with TypeORM',
      status: TaskStatusMap.done,
    })),
    taskRepo.create(createTaskFactory({ 
      title: 'Implement authentication', 
      description: 'Add JWT authentication',
      status: TaskStatusMap.inProgress,
    })),
    taskRepo.create(createTaskFactory({ 
      title: 'Write tests', 
      description: 'Add unit and e2e tests',
      status: TaskStatusMap.todo,
    })),
    taskRepo.create(createTaskFactory({ 
      title: 'Deploy to production', 
      description: 'Setup CI/CD pipeline',
      status: TaskStatusMap.todo,
    })),
  ]);

  console.log(`✅ Created ${tasks.length} tasks`);

  // Assign users to tasks
  tasks[0].assignees = [users[0]];
  tasks[1].assignees = [users[0], users[1]];
  tasks[2].assignees = [users[1], users[2]];
  
  await taskRepo.save(tasks);

  console.log('✅ Assigned users to tasks');
  console.log('🎉 Seeding complete!');

  await dataSource.destroy();
};

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
