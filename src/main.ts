import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import * as hpp from 'hpp';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

import { AppModule } from './app.module';
import { initSentry } from './instrument';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  const sentryDsn = configService.get('sentry.dsn');

  if (sentryDsn) {
    initSentry(sentryDsn);
  }

  app.use(cookieParser());
  app.use(compression());
  app.use(graphqlUploadExpress());

  if (configService.get('appEnv') !== 'development') {
    app.use(hpp());
    app.use(helmet());
  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get('port'), '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
