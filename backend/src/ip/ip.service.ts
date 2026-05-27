import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class IpService {
  constructor(private prisma: PrismaService) {}

  async registrarIp(addressV4: string, notas?: string) {
    return this.prisma.iPRecord.create({
      data: {
        addressV4,
        notas: notas || null
      },
    });
  }

  async obtenerTodas() {
    return this.prisma.iPRecord.findMany();
  }
}