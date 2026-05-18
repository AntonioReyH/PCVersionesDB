import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class IpService {
  constructor(private prisma: PrismaService) {}

  // Guardar una nueva IP
  async registrarIpV4(addressV4: string) {
    return this.prisma.iPRecord.create({
      data: { 
        addressV4: addressV4
      },
    });
  }

  // Listar todas las IPs (nos servirá para ver que funciona)
  async obtenerTodas() {
    return this.prisma.iPRecord.findMany();
  }
}