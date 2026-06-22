import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express'; // <-- SOLUCIÓN: Agregamos 'type' aquí

@Controller('api/auth')
export class AuthController {
  
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {} // Tipamos 'req' por buena práctica

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const googleUser = req.user;
    
    const tokenSimulado = "jwt_super_seguro_generado_aqui";

    res.redirect(`http://localhost:5173/login-success?token=${tokenSimulado}`);
  }
}