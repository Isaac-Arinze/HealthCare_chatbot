// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enhanced Validation Pipe with more options
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out properties that don't have any decorators
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit type conversion
      },
    })
  );

  // Swagger Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Healthcare Chatbot API')
    .setDescription('API for an AI-powered healthcare chatbot system')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth' // This name should match the one used in @ApiBearerAuth() in your controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // This helps keep the token between page refreshes
    },
  });

  // Enhanced CORS Configuration
  app.enableCors({
    origin: [
      'http://localhost:3001', // Your React frontend
      'https://your-production-domain.com', // Production frontend
      /\.your-domain\.com$/, // Regex for all subdomains
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'x-api-key',
    ],
    // credentials: true, // Allow cookies/sessions
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Global prefix for all routes (optional)
  app.setGlobalPrefix('v1'); // Consider versioning your API

  // Get port from environment or use default
  const port = configService.get<number>('PORT') || 3001;
  
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation: ${await app.getUrl()}/api`);
}

bootstrap();