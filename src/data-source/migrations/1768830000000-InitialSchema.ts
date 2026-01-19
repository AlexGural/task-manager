import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1768830000000 implements MigrationInterface {
  name = 'InitialSchema1768830000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(255) NOT NULL,
        "name" character varying(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);

    // Tasks table
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(255) NOT NULL,
        "description" text,
        "status" character varying NOT NULL DEFAULT 'todo',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_tasks_status" ON "tasks" ("status")`);

    // Task assignees (many-to-many)
    await queryRunner.query(`
      CREATE TABLE "task_assignees" (
        "task_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        CONSTRAINT "PK_task_assignees" PRIMARY KEY ("task_id", "user_id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_task_assignees_task_id" ON "task_assignees" ("task_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_task_assignees_user_id" ON "task_assignees" ("user_id")`);

    // Foreign keys with cascade delete
    await queryRunner.query(`
      ALTER TABLE "task_assignees" 
      ADD CONSTRAINT "FK_task_assignees_task" 
      FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "task_assignees" 
      ADD CONSTRAINT "FK_task_assignees_user" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_task_assignees_user"`);
    await queryRunner.query(`ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_task_assignees_task"`);
    await queryRunner.query(`DROP INDEX "IDX_task_assignees_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_task_assignees_task_id"`);
    await queryRunner.query(`DROP TABLE "task_assignees"`);
    await queryRunner.query(`DROP INDEX "IDX_tasks_status"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
