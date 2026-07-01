import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException, Get , Param, NotFoundException, Patch} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('api/usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  //registrando.
  @Post('register')
  @UseInterceptors(FileInterceptor('imagenPerfil')) 
  async registrarUsuario(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @UploadedFile() file: Express.Multer.File
  ) {
  
    if (!file) {
      throw new BadRequestException('La imagen de perfil es obligatoria.');
    }
    
    return this.usuariosService.crear(createUsuarioDto, file);
  }

  //Dashboard de Administrador
  @Post('dashboard-create')
  @UseInterceptors(FileInterceptor('imagenPerfil'))
  async crearDesdeDashboard(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @UploadedFile() file?: Express.Multer.File // El archivo ahora puede ser undefined
  ) {
    return this.usuariosService.crear(createUsuarioDto, file!);
  }

  // mostrando todo los users.
  @Get()
  async findAll() {
    return this.usuariosService.findAll();
  }

  // Alta y baja logica
  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Body('activo') activo: boolean // Angular enviará { "activo": true/false }
  ) {
    try {
      return await this.usuariosService.cambiarEstado(id, activo);
    } catch (error) {
      throw new NotFoundException('No se pudo encontrar el usuario para cambiar su estado.');
    }
  }
  //obtener mail
  @Get('email/:email')
  async findByEmail(@Param('email') email: string) { //PARAM actua como extractor de la ruta.
    const usuario = await this.usuariosService.findOneByEmail(email);
    
    if (!usuario) {
      throw new NotFoundException('No se encontró ningún usuario con ese correo electrónico.');
    }
    
    return usuario;
  }
}