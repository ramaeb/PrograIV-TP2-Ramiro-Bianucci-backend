  import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException, UnauthorizedException, HttpStatus, HttpCode } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
  import { FileInterceptor } from '@nestjs/platform-express';

  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('registro')
    // guardamos temp la foto de perfil
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
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: { usuarioOCorreo: string; clave: string }) {
      if (!body.usuarioOCorreo || !body.clave) {
        throw new BadRequestException('Faltan datos de ingreso.');
      }
      
      return this.authService.login(body.usuarioOCorreo, body.clave);
    }

      //  Validar POR POST
    @Post('validar')
    @HttpCode(HttpStatus.OK) // NestJS por defecto en POST devuelve 201, forzamos 200 OK
    validate(@Body('token') token: string) {
      if (!token) throw new UnauthorizedException('Token requerido');
      return this.authService.validarToken(token);
    }

    // REFRESCAR POR POST
    @Post('refrescar')
    @HttpCode(HttpStatus.OK)
    refresh(@Body('token') token: string) {
      if (!token) throw new UnauthorizedException('Token requerido');
      return this.authService.refreshToken(token);
  }
  }