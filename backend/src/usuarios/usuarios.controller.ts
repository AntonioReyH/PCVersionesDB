import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('api/usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  listar() {
    return this.usuariosService.obtenerTodos();
  }

  // Usamos PATCH porque estamos actualizando un campo específico del recurso
  @Patch(':id/cargo')
  asignarCargo(
    @Param('id') usuarioId: string,
    @Body('cargoId') cargoId: string,
  ) {
    return this.usuariosService.asignarCargo(usuarioId, cargoId);
  }
}