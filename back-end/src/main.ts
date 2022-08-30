import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from 'config';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  app.setGlobalPrefix('api');
  initSwagger(app);
  await app.listen(process.env.PORT || config.get('server.port'));
}

bootstrap();

function initSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Calories App')
    .setDescription('Calories App Api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
}
