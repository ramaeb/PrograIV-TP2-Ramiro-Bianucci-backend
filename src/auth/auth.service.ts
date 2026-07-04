import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { JwtService } from '@nestjs/jwt'; // <-- 1. Importar JwtService
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService, //jwt
  ) {}

  async registrar(dto: CreateUsuarioDto, file: Express.Multer.File) {
    return await this.usuariosService.crear(dto, file);
  }

  
  async login(usuarioOCorreo: string, claveSinEncriptar: string) {
    const usuario = await this.usuariosService.findByEmailOrUsername(usuarioOCorreo);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    if (usuario.activo === false) {
      throw new UnauthorizedException('Tu cuenta ha sido deshabilitada por un administrador.');
    }

    const claveValida = await bcrypt.compare(claveSinEncriptar, usuario.clave);
    if (!claveValida) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const payload = { 
      sub: usuario._id, 
      email: usuario.email, 
      perfil: usuario.perfil 
    };

   
    const tokenGenerado = this.jwtService.sign(payload);
    
    return {
      _id: usuario._id,
      email: usuario.email,
      username: usuario.username,
      perfil: usuario.perfil,
      imagenPerfil: usuario.imagenPerfil || '',
      token: tokenGenerado,
    };
  }

  async validarToken(token: string) {
    try {
      // verify() lanza un error automáticamente si el token expiró o es inválido
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      
      // Devolvemos los datos del usuario contenidos en el payload
      return {
        id: payload.sub,
        username: payload.username,
        email: payload.email,
        perfil: payload.perfil,
      };
    } catch (error) {
      //401
      throw new UnauthorizedException('Token inválido o vencido');
    }
  }

  async refreshToken(token: string) {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      
      // Creamos un nuevo payload limpio (evitando meter campos automáticos como iat/exp viejos)
      const newPayload: JwtPayload = {
        sub: payload.sub,
        username: payload.username,
        email: payload.email,
        role: payload.role,
      };

      return {
        token: this.jwtService.sign(newPayload), // Nuevo token por 15 minutos más
      };
    } catch (error) {
      throw new UnauthorizedException('No se pudo refrescar: Token inválido o vencido');
    }
  }
}