import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class IpService {
  constructor(private prisma: PrismaService) {}

  // Ya no recibimos 'notas' por parámetro
  async registrarIp(addressV4: string) {
    // Para los registros nuevos desde la v4, la etiqueta será solo la IP 
    // o un texto estándar, ya que no hay notas.
    const etiqueta = `${addressV4} | (Generado en v4 sin notas)`;

    return this.prisma.iPRecord.create({
      data: { 
        addressV4, 
        etiqueta 
      },
    });
  }

  async obtenerTodas() {
    return this.prisma.iPRecord.findMany();
  }
}