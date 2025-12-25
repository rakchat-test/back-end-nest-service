import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS - Allow all origins
  // app.enableCors({
  //   origin: true, // Allow all origins
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'x-secret'],
  //   credentials: true,
  // });

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
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3011);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3011}`,
  );
  console.log(
    `Swagger documentation: http://localhost:${process.env.PORT ?? 3011}/api`,
  );
}
bootstrap();
