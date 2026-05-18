import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class IpService {
  constructor(private prisma: PrismaService) {}

  async registrarIp(addressV4: string, notas?: string) {
    // Generamos el dato proyectado en el backend para los nuevos registros
    const etiqueta = `${addressV4} | ${notas || 'Sin notas'}`;

    return this.prisma.iPRecord.create({
      data: { 
        addressV4, 
        notas: notas || null,
        etiqueta // Guardamos el dato
      },
    });
  }

  async obtenerTodas() {
    return this.prisma.iPRecord.findMany();
  }
}