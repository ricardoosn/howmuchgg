import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import connectRedis from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { RedisService } from './core/redis/redis.service';
import { SESSION_CONFIG } from './shared/constants/session.constants';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(cookieParser());
  const redisService = app.get(RedisService);
  const RedisStore = connectRedis;
  const redisStore = new RedisStore({
    client: redisService.getClient(),
    prefix: 'session:',
  });
  app.use(
    session({
      store: redisStore,
      secret: SESSION_CONFIG.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: SESSION_CONFIG.maxAgeMs,
        secure: SESSION_CONFIG.secure,
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('HowMuchGG API')
    .setDescription('Public API for games, profiles, and community pricing')
    .setVersion('1.0.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(3000);
}

bootstrap();
