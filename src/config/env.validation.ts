import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';
import { NodeEnv, NodeEnvMap } from '@config/node-env';

export class EnvVariables {
  @IsEnum(NodeEnvMap)
  NODE_ENV: NodeEnv = NodeEnvMap.development;

  @IsNumber()
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number = 5432;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_DATABASE: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors.map((error) => {
      const constraints = Object.values(error.constraints || {}).join(', ');
      return `  - ${error.property}: ${constraints}`;
    });

    throw new Error(
      `\n Environment validation failed!\n\nMissing or invalid variables:\n${errorMessages.join('\n')}\n`,
    );
  }

  return validatedConfig;
}
