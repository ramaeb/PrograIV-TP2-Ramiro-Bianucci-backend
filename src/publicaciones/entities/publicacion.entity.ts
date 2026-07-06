import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true }) // Genera automáticamente createdAt y updatedAt
export class Publicacion extends Document {
  @Prop({ required: true })
  titulo!: string;

  @Prop({ required: true })
  descripcion!: string;

  @Prop({ default: null })
  imagenUrl!: string;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuarioId!: Types.ObjectId;

  @Prop({ required: true })
  autorUsuario!: string;

  @Prop({ default: true })
  activo!: boolean; // Para la baja lógica

  // asdas
  @Prop({ 
    type: [{ 
      usuarioId: { type: Types.ObjectId, ref: 'Usuario' }, 
      fecha: { type: Date, default: Date.now } 
    }], 
    default: [] 
  })
  likes!: { usuarioId: Types.ObjectId; fecha: Date }[];

  @Prop({ type: [Object], default: [] })
  comentarios!: any[];
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);