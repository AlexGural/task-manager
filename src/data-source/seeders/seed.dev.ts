import { DataSource } from 'typeorm';
import { dataSourceOptions } from '@data-source/datasource';
import { UserRecord } from '@domain/users/infrastructure/persistence/schema/user.record';
import { TaskRecord } from '@domain/tasks/infrastructure/persistence/schema/task.record';
import { createUserFactory } from '@data-source/factories/user.factory';
import { createTaskFactory } from '@data-source/factories/task.factory';
import { TaskStatusMap } from '@domain/tasks/domain/task-status';

const seedDev = async () => {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  console.log('Seeding dev db ...');

  const userRepo = dataSource.getRepository(UserRecord);
  const taskRepo = dataSource.getRepository(TaskRecord);

  // Check if already seeded
  const existingUsers = await userRepo.count();
  if (existingUsers > 0) {
    console.log('⏭️  Database already seeded, skipping...');
    await dataSource.destroy();
    return;
  }

  // Create demo users
  const users = await userRepo.save([
    userRepo.create(createUserFactory({ email: 'alice@demo.com', name: 'Alice Developer' })),
    userRepo.create(createUserFactory({ email: 'bob@demo.com', name: 'Bob Manager' })),
    userRepo.create(createUserFactory({ email: 'charlie@demo.com', name: 'Charlie Designer' })),
    userRepo.create(createUserFactory({ email: 'diana@demo.com', name: 'Diana QA' })),
    userRepo.create(createUserFactory({ email: 'eve@demo.com', name: 'Eve DevOps' })),
  ]);

  console.log(`✅ Created ${users.length} demo users`);

  // Create demo tasks with various statuses
  const tasks = await taskRepo.save([
    // Todo tasks
    taskRepo.create(createTaskFactory({ 
      title: 'Implement user profile page', 
      description: 'Create a page where users can view and edit their profile information',
      status: TaskStatusMap.todo,
    })),
    taskRepo.create(createTaskFactory({ 
      title: 'Add email notifications', 
      description: 'Send email notifications when tasks are assigned',
      status: TaskStatusMap.todo,
    })),
    taskRepo.create(createTaskFactory({ 
      title: 'Create mobile app', 
      description: 'Build React Native mobile application',
      status: TaskStatusMap.todo,
    })),
    // In progress tasks
    taskRepo.create(createTaskFactory({ 
      title: 'Implement search functionality', 
      description: 'Add full-text search for tasks',
      status: TaskStatusMap.inProgress,
    })),
    taskRepo.create(createTaskFactory({ 
      title: 'Optimize database queries', 
      description: 'Add indexes and optimize slow queries',
      status: TaskStatusMap.inProgress,
    })),
    // Done tasks
    taskRepo.create(createTaskFactory({ 
      title: 'Setup CI/CD pipeline', 
      description: 'Configure GitHub Actions for automated testing and deployment',
      status: TaskStatusMap.done,
    })),
    taskRepo.create(createTaskFactory({ 
      title: 'Design system documentation', 
      description: 'Document all UI components and design tokens',
      status: TaskStatusMap.done,
    })),
    taskRepo.create(createTaskFactory({ 
      title: 'API documentation', 
      description: 'Setup Swagger and document all endpoints',
      status: TaskStatusMap.done,
    })),
  ]);

  console.log(`✅ Created ${tasks.length} demo tasks`);

  // Assign users to tasks realistically
  tasks[0].assignees = [users[0]]; // Alice
  tasks[1].assignees = [users[0], users[4]]; // Alice, Eve
  tasks[2].assignees = [users[0], users[2]]; // Alice, Charlie
  tasks[3].assignees = [users[0], users[3]]; // Alice, Diana
  tasks[4].assignees = [users[4]]; // Eve
  tasks[5].assignees = [users[4]]; // Eve
  tasks[6].assignees = [users[2]]; // Charlie
  tasks[7].assignees = [users[0], users[1]]; // Alice, Bob

  await taskRepo.save(tasks);

  console.log('✅ Assigned users to tasks');
  console.log('');
  console.log('🎉 Development seeding complete!');
  console.log('');
  console.log('Demo users:');
  users.forEach(u => console.log(`  - ${u.email} (${u.name})`));

  await dataSource.destroy();
};

seedDev().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
