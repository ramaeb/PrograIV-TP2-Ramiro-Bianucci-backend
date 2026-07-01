import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

// auth.service.ts
@Injectable()
export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

  // LÓGICA DE REGISTRO
  async registrar(dto: CreateUsuarioDto, file: Express.Multer.File) {
    return await this.usuariosService.crear(dto, file);
  }

  // LÓGICA DE LOGIN 
  async login(usuarioOCorreo: string, claveSinEncriptar: string) {
    const usuario = await this.usuariosService.findByEmailOrUsername(usuarioOCorreo);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const claveValida = await bcrypt.compare(claveSinEncriptar, usuario.clave);

    if (!claveValida) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const datosUsuario = usuario.toObject();
    delete datosUsuario.clave;
    return datosUsuario;
  }
}