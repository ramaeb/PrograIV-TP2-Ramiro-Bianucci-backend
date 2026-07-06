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

  //contador para el sprint 5, de login.
  @Prop({ type: Number, default: 0 })
  contadorLogins!: number;
  // Agregá esta propiedad al final de tu clase Usuario en usuario.entity.ts
  @Prop({ type: Number, default: 0 })
  visitasDeTerceros!: number;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);