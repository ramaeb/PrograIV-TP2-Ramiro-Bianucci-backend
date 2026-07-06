import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion } from '../publicaciones/entities/publicacion.entity'; // Ajustá la ruta a tu entidad
import { Usuario } from '../usuarios/entities/usuario.entity'; // Ajustá la ruta a tu entidad
@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Publicacion.name) private readonly publicacionModel: Model<any>,
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
  ) {}

  //publicaciones por usuario en un lapso de tiempo
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

  // cantidad de comentarios globales
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

  // comentarios en cada publicación en un lapso de tiempo
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
  // 🚪 Consigna 1: Cantidad de ingresos (log in) por usuario
  async getIngresosPorUsuario(fechaInicio: string, fechaFin: string) {
    const usuarios = await this.usuarioModel
      .find({}, 'username contadorLogins')
      .sort({ contadorLogins: -1 })
      .limit(15)
      .exec();

    return usuarios.map(u => ({
      _id: u.username || 'Anónimo',
      // 🚀 ERROR SOLUCIONADO: Accedemos a la propiedad directo, sin el .get()
      cantidad: u.contadorLogins || 0 
    }));
  }
  
  //  Cantidad de me gusta (likes) otorgados por día en el lapso
  async getLikesPorDia(fechaInicio: string, fechaFin: string) {
    return await this.publicacionModel.aggregate([
      // 1. Desarmamos el array de likes para tener un documento por cada corazón
      { $unwind: '$likes' }, 
      // 2. Filtramos solo los likes que se dieron en el rango de fechas que pidió el front
      {
        $match: {
          'likes.fecha': { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) }
        }
      },
      // 3. Agrupamos por la fecha exacta (sin la hora)
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$likes.fecha' } },
          cantidad: { $sum: 1 } // Contamos un like por cada documento
        }
      },
      // 4. Ordenamos de más viejo a más nuevo para el gráfico
      { $sort: { _id: 1 } }
    ]);
  }
  async getVisitasPerfilTerceros(fechaInicio: string, fechaFin: string) {
    const usuarios = await this.usuarioModel
      .find({}, 'username visitasDeTerceros')
      .sort({ visitasDeTerceros: -1 })
      .limit(10)
      .exec();

    return usuarios.map(u => ({
      username: u.username || 'Perfil',
  
      cantidad: u.visitasDeTerceros || 0 
    }));
  }
  
}