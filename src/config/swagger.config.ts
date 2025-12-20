import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Egyptian Railways API')
  .setDescription('API documentation for the Egyptian Railways system.')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();
