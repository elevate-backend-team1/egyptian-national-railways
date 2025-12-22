import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*', // Configure this based on your frontend URL in production
    credentials: true
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      customSiteTitle: 'Egyptian Railways API Docs'
    }
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true // Automatically transform payloads to DTO instances
    })
  );

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global JWT authentication guard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(3000);
  console.log('🚀 Egyptian National Railways API is running on: http://localhost:3000');
}
bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
