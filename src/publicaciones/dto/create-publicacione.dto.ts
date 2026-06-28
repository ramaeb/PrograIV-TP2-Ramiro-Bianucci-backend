import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true }) // Genera automáticamente createdAt y updatedAt
export class PublicacionDto extends Document {
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

  @Prop({ type: [Types.ObjectId], default: [] })
  likes!: Types.ObjectId[]; // Almacena qué IDs de usuarios dieron like

  @Prop({ type: [Object], default: [] })
  comentarios!: any[];
}

export const PublicacionSchema = SchemaFactory.createForClass(PublicacionDto);