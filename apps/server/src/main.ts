import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import type { NextFunction, Request, Response } from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security: Helmet
  app.use(helmet({
    contentSecurityPolicy: false, // 禁用默认的 CSP，防止静态资源加载问题
    crossOriginEmbedderPolicy: false,
  }));

  // Performance: Compression
  app.use(compression());

  // Enable CORS
  // Production: Should be configured with specific origin
  app.enableCors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global Prefix (Exclude ViewController)
  app.setGlobalPrefix('api');

  // Global Validation Pipe (Zod)
  app.useGlobalPipes(new ZodValidationPipe());

  // Global Interceptor (Response Format)
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global Filter (Exception Handling)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger Configuration
  // patchNestJsSwagger(); // Auto-generate Swagger from Zod schemas
  const config = new DocumentBuilder()
    .setTitle('长沙方言守护计划 API')
    .setDescription('The Changsha Dialect Project API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      next();
      return;
    }
    if (req.path.startsWith('/api')) {
      next();
      return;
    }
    if (req.path.startsWith('/static') || req.path.startsWith('/admin/static')) {
      next();
      return;
    }
    if (req.path.startsWith('/docs')) {
      next();
      return;
    }
    if (req.path.includes('.')) {
      next();
      return;
    }

    if (req.path.startsWith('/admin')) {
      res.sendFile(join(__dirname, '..', 'public', 'admin', 'index.html'));
      return;
    }
    res.sendFile(join(__dirname, '..', 'public', 'user', 'index.html'));
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/docs`);
}
bootstrap();
