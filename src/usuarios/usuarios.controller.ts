import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('api/usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('imagenPerfil')) // El nombre debe coincidir con el append() de Angular
  async registrarUsuario(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    // Validación: Si el archivo de imagen es obligatorio, lo chequeamos acá
    if (!file) {
      throw new BadRequestException('La imagen de perfil es obligatoria.');
    }

    // Le pasamos el DTO y el archivo procesado al servicio
    return this.usuariosService.crear(createUsuarioDto, file);
  }
}