import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { FiltroFechaDto } from './dto/filtro-fecha.dto';
import { AdminGuard } from '../guards/admin-guard/admin-guard.guard'; // Tu nuevo Guard

@Controller('estadisticas')
@UseGuards(AdminGuard) //guard
export class EstadisticasController {
  constructor(private readonly estadisticasService : EstadisticasService) {}

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
    return this.estadisticasService.getIngresosPorUsuario(filtro.fechaInicio, filtro.fechaFin);
  }

  @Get('visitas-perfil')
  async visitasPerfil(@Query() filtro: FiltroFechaDto) {
    return this.estadisticasService.getVisitasPerfilTerceros(filtro.fechaInicio, filtro.fechaFin);
  }

  @Get('likes-por-dia')
  async likesPorDia(@Query() filtro: FiltroFechaDto) {
    return this.estadisticasService.getLikesPorDia(filtro.fechaInicio, filtro.fechaFin);
  }
  
}