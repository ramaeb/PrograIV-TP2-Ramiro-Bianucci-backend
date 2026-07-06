import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { FiltroFechaDto } from './dto/filtro-fecha.dto';
import { AdminGuard } from '../guards/admin-guard/admin-guard.guard'; // Tu nuevo Guard
import { UsuariosService } from '../usuarios/usuarios.service'; // Importa el servicio de usuarios

@Controller('estadisticas')
@UseGuards(AdminGuard) //guard
export class EstadisticasController {
  constructor(
    private readonly estadisticasService: EstadisticasService,
    private readonly usuariosService: UsuariosService
  ) {}

  @Get('posts-por-usuario')
  async postsPorUsuario(@Query() filtro: FiltroFechaDto) {
    return this.estadisticasService.getPostsPorUsuario(filtro.fechaInicio, filtro.fechaFin);
  }
  
  @Get('comentarios-totales')
  async comentariosTotales(@Query() filtro: FiltroFechaDto) {
    // El Guard ya validó que seas Admin, entrás directo al servicio:
    return this.estadisticasService.getComentariosTotales(filtro.fechaInicio, filtro.fechaFin);
  }

  @Get('comentarios-por-post')
  async comentariosPorPost(@Query() filtro: FiltroFechaDto) {
    // Limpio y sin lógica repetida:
    return this.estadisticasService.getComentariosPorPost(filtro.fechaInicio, filtro.fechaFin);
  }

  //sprint 5 
 @Get('ingresos-usuario')
  async ingresosUsuario(@Query() filtro: FiltroFechaDto) {
    // Apunta al método de tu EstadisticasService que hace el .find() y el .map()
    return this.estadisticasService.getIngresosPorUsuario();
  }

  @Get('visitas-perfil')
  async visitasPerfil(@Query() filtro: FiltroFechaDto) {
    // Apunta al método de tu EstadisticasService que retorna el ranking de perfiles más vistos
    return this.estadisticasService.getVisitasPerfilTerceros();
  }

  @Get('likes-por-dia')
  async likesPorDia(@Query() filtro: FiltroFechaDto) {
    return this.estadisticasService.getLikesPorDia(filtro.fechaInicio, filtro.fechaFin);
  }
  
}