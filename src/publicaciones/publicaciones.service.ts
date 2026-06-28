import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Publicacion } from './entities/publicacion.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Console } from 'console';
import { PublicacionDto } from './dto/create-publicacione.dto';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name) private pubModel: Model<Publicacion>,
    private cloudinaryService: CloudinaryService
  ) {}

  // Cambiá el inicio del método crear por este:
async crear(datos: PublicacionDto, file?: Express.Multer.File) {
  let urlImagen: string | null = null; // En lugar de ''
  
  if (file) {
    urlImagen = await this.cloudinaryService.subirImagen(file);
  }

  const nuevaPub = new this.pubModel({
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    usuarioId: new Types.ObjectId(datos.usuarioId),
    autorUsuario: datos.autorUsuario,
    imagenUrl: urlImagen, // Guarda la URL o null si no se seleccionó archivo
  });

  console.log("Publicación creada con éxito");
  return nuevaPub.save();
}

  async listar(orden: 'fecha' | 'likes', usuarioId?: string, limit: number = 10, offset: number = 0) {
    const filtro: any = { activo: true }; // Solo traemos las que no sufrieron baja lógica
    
    if (usuarioId) {
      filtro.usuarioId = new Types.ObjectId(usuarioId);
    }

    let query = this.pubModel.find(filtro).skip(offset).limit(limit);

    if (orden === 'fecha') {
      query = query.sort({ createdAt: -1 }); // Más nuevas primero
      return query.exec();
    } else {
      // Ordenar por cantidad de likes usando agregaciones o cálculo en memoria para simplificar
      const publicaciones = await query.exec();
      return publicaciones.sort((a, b) => b.likes.length - a.likes.length);
    }
  }

  async bajaLogica(pubId: string, solicitanteId: string, perfil: string) {
    const pub = await this.pubModel.findById(pubId);
    if (!pub || !pub.activo) throw new NotFoundException('La publicación no existe.');

    // Validar permisos: Debe ser el dueño O un administrador
    if (pub.usuarioId.toString() !== solicitanteId && perfil !== 'admin') {
      throw new ForbiddenException('No tenés permisos para dar de baja esta publicación.');
    }

    pub.activo = false; // Baja lógica
    return pub.save();
  }

  async darLike(pubId: string, usuarioId: string) {
    const pub = await this.pubModel.findById(pubId);
    if (!pub || !pub.activo) throw new NotFoundException('Publicación no encontrada.');

    const userObjId = new Types.ObjectId(usuarioId);
    
    // Validar si ya le dio like
    if (pub.likes.some(id => id.equals(userObjId))) {
      throw new BadRequestException('Ya le diste me gusta a esta publicación.');
    }

    pub.likes.push(userObjId);
    return pub.save();
  }

  async quitarLike(pubId: string, usuarioId: string) {
    const pub = await this.pubModel.findById(pubId);
    if (!pub || !pub.activo) throw new NotFoundException('Publicación no encontrada.');

    const userObjId = new Types.ObjectId(usuarioId);

    if (!pub.likes.some(id => id.equals(userObjId))) {
      throw new BadRequestException('No habías dado me gusta en esta publicación.');
    }

    pub.likes = pub.likes.filter(id => !id.equals(userObjId));
    return pub.save();
  }
}