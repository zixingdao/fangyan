import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';

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

  // Global Prefix
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

  const port = process.env.PORT || 80;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/docs`);
}
bootstrap();
