import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvVariables } from '@config/env.validation';
import { NodeEnvMap } from '@config/node-env';

export const getDatabaseConfig = (configService: ConfigService<EnvVariables>): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', { infer: true }),
  port: configService.get('DB_PORT', { infer: true }),
  username: configService.get('DB_USERNAME', { infer: true }),
  password: configService.get('DB_PASSWORD', { infer: true }),
  database: configService.get('DB_DATABASE', { infer: true }),
  entities: [__dirname + '/../domain/**/schema/*.record{.ts,.js}'],
  migrations: [__dirname + '/../data-source/migrations/*{.ts,.js}'],
  migrationsRun: true,
  // changes only via migrations in all environments
  synchronize: false,
  logging: configService.get('NODE_ENV', { infer: true }) === NodeEnvMap.development,
});
