import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
//SCHEMA DE MONGOOSE PARA USUARIO.
@Schema()
export class Usuario extends Document {
  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  clave!: string; 

  @Prop({ required: true })
  perfil!: string;
  
  @Prop({ required: true })
  fechaNacimiento!: string;
  
  @Prop({ required: true })
  imagenPerfil!: string;

  @Prop({ type: Boolean, default: true })
  activo!: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);