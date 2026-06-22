import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Usuario extends Document {
  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  clave!: string; 

  @Prop({ required: true })
  imagenPerfil!: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);