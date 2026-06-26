import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Publicacion, PublicacionSchema } from './entities/publicacion.entity'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Publicacion.name, 
        schema: PublicacionSchema   
      }
    ]),
    CloudinaryModule, 
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}