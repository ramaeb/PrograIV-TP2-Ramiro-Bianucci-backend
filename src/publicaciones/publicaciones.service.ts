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

async crear(datos: PublicacionDto, file?: Express.Multer.File) {
  let urlImagen: string | null = null;
  
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
      // Ordenar por cantidad de likes usando agregaciones
      const publicaciones = await query.exec();
      return publicaciones.sort((a, b) => b.likes.length - a.likes.length);
    }
  }

  async bajaLogica(pubId: string, solicitanteId: string, perfil: string) {
    const pub = await this.pubModel.findById(pubId);
    if (!pub || !pub.activo) throw new NotFoundException('La publicación no existe.');

    //o admin o dueño de la publicacion
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
    
    // busca dentro de obj
    if (pub.likes.some(like => like.usuarioId.equals(userObjId))) {
      throw new BadRequestException('Ya le diste me gusta a esta publicación.');
    }

    // obj con fecha de hoy
    pub.likes.push({ usuarioId: userObjId, fecha: new Date() });
    
    // Le avisamos a Mongoose de este cambio profundo
    pub.markModified('likes');
    return pub.save();
  }

  async quitarLike(pubId: string, usuarioId: string) {
    const pub = await this.pubModel.findById(pubId);
    if (!pub || !pub.activo) throw new NotFoundException('Publicación no encontrada.');

    const userObjId = new Types.ObjectId(usuarioId);

    // validacion
    if (!pub.likes.some(like => like.usuarioId.equals(userObjId))) {
      throw new BadRequestException('No habías dado me gusta en esta publicación.');
    }

    //miramos id interno
    pub.likes = pub.likes.filter(like => !like.usuarioId.equals(userObjId));
    
    pub.markModified('likes');
    return pub.save();
  }
  async agregarComentario(pubId: string, autorUsername: string, texto: string) {
    const pub = await this.pubModel.findById(pubId);
    if (!pub || !pub.activo) throw new NotFoundException('La publicación no existe o fue dada de baja.');

    // Creamos el nuevo objeto comentario estructurado
    const nuevoComentario = {
      _id: new Types.ObjectId(),
      autorUsername: autorUsername,
      texto: texto,
      fecha: new Date()
    };

    // Agregamos al array interno
    pub.comentarios.push(nuevoComentario);
    
    // 💡 Le avisamos a Mongoose que modificamos manualmente este array para que guarde seguro los cambios
    pub.markModified('comentarios'); 

    return pub.save(); 
  }

  async editarComentario(pubId: string, comentarioId: string, username: string, nuevoTexto: string) {
    const pub = await this.pubModel.findById(pubId);
    if (!pub || !pub.activo) throw new NotFoundException('La publicación no existe.');

    // Buscamos el comentario dentro del array de la publicación
    const comentario = pub.comentarios.find(c => c._id.toString() === comentarioId);
    if (!comentario) throw new NotFoundException('El comentario no existe.');

    // 🔒 Control estricto: Solo el creador del comentario puede editarlo
    if (comentario.autorUsername !== username) {
      throw new ForbiddenException('No tenés permisos para editar este comentario.');
    }

    // Actualizamos el contenido y marcamos como editado
    comentario.texto = nuevoTexto;
    comentario.editado = true; // 🎯 Flag para anunciar la edición
    comentario.fechaEdicion = new Date(); // Opcional, por si querés guardar el rastro

    pub.markModified('comentarios');
    return pub.save(); // Retorna la publicación con los comentarios actualizados
  }
}