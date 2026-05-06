import { Module } from '@nestjs/common';
import { IpService } from './ip.service';
import { IpController } from './ip.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [IpController], // ¡Esto expone las rutas!
  providers: [IpService, PrismaService],
})
export class IpModule {}