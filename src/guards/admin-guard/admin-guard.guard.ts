import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no provisto.');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      // Adjuntamos el usuario al request por si hiciera falta
      request['user'] = payload;

      // 🔐 Validación del rol admin requerida por el TP
      if (payload.perfil !== 'admin') {
        throw new ForbiddenException('Se requieren permisos de administrador.');
      }
      
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido.');
    }
  }
}