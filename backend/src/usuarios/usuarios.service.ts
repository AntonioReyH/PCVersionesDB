import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  // Este es el motor de la asignación
  async asignarCargo(usuarioId: string, cargoId: string) {
    const usuarioExiste = await this.prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuarioExiste) throw new NotFoundException('Usuario no encontrado');

    const cargoExiste = await this.prisma.cargo.findUnique({ where: { id: cargoId } });
    if (!cargoExiste) throw new NotFoundException('Cargo no válido');

    return this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { cargoId: cargoId },
      include: { cargo: true }, // Devolvemos el usuario con la info del cargo actualizado
    });
  }

  async obtenerTodos() {
    return this.prisma.usuario.findMany({ include: { cargo: true } });
  }
}