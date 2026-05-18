import { Controller, Post, Get, Body } from '@nestjs/common';
import { IpService } from './ip.service';

@Controller('api/ip')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  @Post()
  crear(
    @Body('addressV4') addressV4: string,
    @Body('addressV6') addressV6?: string // <-- Recibimos el nuevo campo
  ) {
    return this.ipService.registrarIp(addressV4, addressV6);
  }

  @Get()
  listar() {
    return this.ipService.obtenerTodas();
  }
}