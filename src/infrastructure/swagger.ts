import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('Task Manager API documentation')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-token-id', in: 'header' },
      'x-token-id',
    )
    .addSecurityRequirements('x-token-id')
    .addTag('users', 'User management endpoints')
    .addTag('tasks', 'Task management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document, {
    jsonDocumentUrl: 'api/doc/json',
  });
}
