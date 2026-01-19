import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv } from '@config/env.validation';
import { getDatabaseConfig } from '@config/database.config';
import { TasksModule } from '@domain/tasks/tasks.module';
import { UsersModule } from '@domain/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {}
