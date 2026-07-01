import { 
  Controller, Post, Get, Delete, Body, Param, Query, 
  UseInterceptors, UploadedFile, BadRequestException, HttpCode, HttpStatus, 
  Put
} from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicacionDto } from './dto/create-publicacione.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}
      
  // Alta de publicación con imagen opcional
  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async crear(
    @Body() createPublicacionDto: PublicacionDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.publicacionesService.crear(createPublicacionDto, file);
  }

  // Listar con filtros, orden dinámico y paginación (limit/offset)
  @Get()
  async listar(
    @Query('orden') orden: 'fecha' | 'likes' = 'fecha',
    @Query('usuarioId') usuarioId?: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0'
  ) {
    return this.publicacionesService.listar(orden, usuarioId, +limit, +offset);
  }

  // Baja lógica controlada
  @Delete(':id')
  async darDeBaja(
    @Param('id') id: string,
    @Body() body: { usuarioId: string; perfil: string }
  ) {
    return this.publicacionesService.bajaLogica(id, body.usuarioId, body.perfil);
  }

  // Dar un único like
  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  async darLike(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return this.publicacionesService.darLike(id, usuarioId);
  }

  //Quitar un "Me gusta" previamente realizado
  @Delete(':id/like')
  async quitarLike(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return this.publicacionesService.quitarLike(id, usuarioId);
  }

  //agregando comentario
  @Post(':id/comentario')
  async agregarComentario(
    @Param('id') id: string,
    @Body() body: { autorUsername: string; texto: string }
  ) {
    if (!body.autorUsername || !body.texto) {
      throw new BadRequestException('El nombre de autor y el texto del comentario son obligatorios.');
    }
    return this.publicacionesService.agregarComentario(id, body.autorUsername, body.texto);
  }
  
  //endpoint PUT
  @Put(':id/comentario/:comentarioId')
  async editarComentario(
    @Param('id') id: string, //Captura las variables de la URL
    @Param('comentarioId') comentarioId: string,
    @Body() body: { autorUsername: string; nuevoTexto: string }
  ) {
    if (!body.autorUsername || !body.nuevoTexto) {
      throw new BadRequestException('El username del autor y el nuevo texto son obligatorios.');
    }
    return this.publicacionesService.editarComentario(id, comentarioId, body.autorUsername, body.nuevoTexto);
  }
}