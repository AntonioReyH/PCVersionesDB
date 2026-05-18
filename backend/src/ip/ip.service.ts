import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class IpService {
  constructor(private prisma: PrismaService) {}

  // Agregamos addressV6 como parámetro opcional
  async registrarIp(addressV4: string, addressV6?: string) {
    // Mantenemos la etiqueta para el historial de versiones
    const etiqueta = addressV6 
      ? `${addressV4} + ${addressV6} | (Generado en v5)`
      : `${addressV4} | (Generado en v5)`;

    return this.prisma.iPRecord.create({
      data: { 
        addressV4, 
        addressV6: addressV6 || null,
        etiqueta 
      },
    });
  }

  async obtenerTodas() {
    return this.prisma.iPRecord.findMany();
  }
}