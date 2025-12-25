import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedApp: express.Express;

async function createApp() {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  // Set global prefix (not needed for Vercel, but can be useful)
  // app.setGlobalPrefix('api'); // Don't use this on Vercel

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-secret'],
    credentials: true,
  });

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Gun full stack test API')
    .setDescription('The Gun full stack test API documentation')
    .setVersion('1.0')
    .addTag('users')
    .addTag('webhook')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // On Vercel, Swagger is accessible at /docs (no prefix needed)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js',
    ],
  });

  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

export default async function handler(req: express.Request, res: express.Response) {
  const app = await createApp();
  return app(req, res);
}

