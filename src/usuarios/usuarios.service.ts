import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './entities/usuario.entity'; 
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as bcrypt from 'bcrypt'; // 1. Importamos bcrypt

@Injectable()
export class UsuariosService {
  
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>, //Modelo de mongoose para el usuario.
    private cloudinaryService: CloudinaryService // Inyectamos el servicio de Cloudinary
  ) {}

  
  async crear(createUsuarioDto: CreateUsuarioDto, file: Express.Multer.File): Promise<any> {
    const { email, username, clave, perfil, ...restoDatos } = createUsuarioDto;


    const existeEmail = await this.findOneByEmail(email);
    if (existeEmail) {
      throw new ConflictException('Este correo electrónico ya está registrado.');
    }

    
    const existeUsername = await this.findOneByUsername(username);
    if (existeUsername) {
      throw new ConflictException('Este nombre de usuario ya está ocupado.');
    }

   
    const saltRounds = 10;
    const hashClave = await bcrypt.hash(clave, saltRounds);


    const urlImagenPerfil = await this.cloudinaryService.subirImagen(file);


    const perfilAsignado = perfil || 'usuario';

    const usuarioParaGuardar = new this.usuarioModel({
      ...restoDatos,
      email,
      username,
      perfil: perfilAsignado,
      clave: hashClave,         
      imagenPerfil: urlImagenPerfil 
    });

    const usuarioGuardado = await usuarioParaGuardar.save();

    const usuarioObj = usuarioGuardado.toObject();

    const { clave: _, ...usuarioSinClave } = usuarioObj;

    return usuarioSinClave;
  }

  async findOneByUsername(username: string): Promise<Usuario | null> {
    return await this.usuarioModel.findOne({ username }).exec();
  }

  async findOneByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioModel.findOne({ email }).exec();
  }

  async findByEmailOrUsername(termino: string): Promise<Usuario | null> {
    return await this.usuarioModel.findOne({
      $or: [{ email: termino }, { username: termino }]
    }).exec();
  }

  async findAll() {
    return await this.usuarioModel.find().exec();
  }
    
  async findOne(id: string): Promise<Usuario | null> {
    return await this.usuarioModel.findById(id).exec(); 
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return await this.usuarioModel.findByIdAndUpdate(id, updateUsuarioDto, { new: true }).exec();
  }

  async remove(id: string) {
    return await this.usuarioModel.findByIdAndDelete(id).exec();
  }
}