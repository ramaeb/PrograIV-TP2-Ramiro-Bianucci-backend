  import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
  import { FileInterceptor } from '@nestjs/platform-express';

  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('registro')
    // Interceptamos el archivo 'fotoPerfil' y lo dejamos guardado temporalmente en MEMORIA
    @UseInterceptors(FileInterceptor('fotoPerfil')) 
    async registro(
      @Body() createUsuarioDto: CreateUsuarioDto,
      @UploadedFile() file: Express.Multer.File,
    ) {
      if (!file) {
        throw new BadRequestException('La imagen de perfil es obligatoria.');
      }

      return this.authService.registrar(createUsuarioDto, file);
    }

    @Post('login')
    async login(@Body() body: { usuarioOCorreo: string; clave: string }) {
      if (!body.usuarioOCorreo || !body.clave) {
        throw new BadRequestException('Faltan datos de ingreso.');
      }
      
      return this.authService.login(body.usuarioOCorreo, body.clave);
    }
  }