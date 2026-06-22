import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IpModule } from './ip/ip.module'; // <-- 1. Importamos nuestro módulo
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [IpModule, AuthModule], // <-- 2. Lo agregamos a la lista de imports
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}