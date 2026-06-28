import { 
  Controller, Post, Get, Delete, Body, Param, Query, 
  UseInterceptors, UploadedFile, BadRequestException, HttpCode, HttpStatus 
} from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicacionDto } from './dto/create-publicacione.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}
      
  // ○ Por POST: Alta de publicación con imagen opcional
  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async crear(
    @Body() createPublicacionDto: PublicacionDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.publicacionesService.crear(createPublicacionDto, file);
  }

  // ○ Por GET: Listar con filtros, orden dinámico y paginación (limit/offset)
  @Get()
  async listar(
    @Query('orden') orden: 'fecha' | 'likes' = 'fecha',
    @Query('usuarioId') usuarioId?: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0'
  ) {
    return this.publicacionesService.listar(orden, usuarioId, +limit, +offset);
  }

  // ○ Por DELETE: Baja lógica controlada por creador o admin
  @Delete(':id')
  async darDeBaja(
    @Param('id') id: string,
    @Body() body: { usuarioId: string; perfil: string }
  ) {
    return this.publicacionesService.bajaLogica(id, body.usuarioId, body.perfil);
  }

  // ○ Por POST: Dar un único "Me gusta"
  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  async darLike(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return this.publicacionesService.darLike(id, usuarioId);
  }

  // ○ Por DELETE: Quitar un "Me gusta" previamente realizado
  @Delete(':id/like')
  async quitarLike(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return this.publicacionesService.quitarLike(id, usuarioId);
  }
}