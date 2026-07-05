import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion } from '../publicaciones/entities/publicacion.entity'; // Ajustá la ruta a tu entidad

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel('Publicacion') private readonly publicacionModel: Model<any>,
  ) {}

  // 1. Cantidad de publicaciones por usuario en un lapso de tiempo
  async getPostsPorUsuario(fechaInicio: string, fechaFin: string) {
    return await this.publicacionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) },
        },
      },
      {
        $group: {
          _id: '$autorUsuario',
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { cantidad: -1 } },
    ]);
  }

  // 2. Cantidad de comentarios globales realizados en un lapso de tiempo (agrupado por día)
  async getComentariosTotales(fechaInicio: string, fechaFin: string) {
    return await this.publicacionModel.aggregate([
      { $unwind: '$comentarios' },
      {
        $match: {
          'comentarios.fecha': { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$comentarios.fecha' } },
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  // 3. Cantidad de comentarios en cada publicación en un lapso de tiempo
  async getComentariosPorPost(fechaInicio: string, fechaFin: string) {
    return await this.publicacionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) },
        },
      },
      {
        $project: {
          titulo: 1,
          cantidadComentarios: { $size: { $ifNull: ['$comentarios', []] } },
        },
      },
      { $sort: { cantidadComentarios: -1 } },
      { $limit: 10 }, // Limitamos a los 10 principales para no saturar el gráfico
    ]);
  }
}