import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitamos CORS para que React pueda comunicarse con NestJS
  app.enableCors(); 
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();