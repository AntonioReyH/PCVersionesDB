import { Controller, Post, Get, Body } from '@nestjs/common';
import { IpService } from './ip.service';

@Controller('api/ip') // <-- Esto define la URL
export class IpController {
  constructor(private readonly ipService: IpService) {}

  @Post()
  crear(@Body('addressV4') addressV4: string) {
    return this.ipService.registrarIpV4(addressV4);
  }

  @Get()
  listar() {
    return this.ipService.obtenerTodas();
  }
}