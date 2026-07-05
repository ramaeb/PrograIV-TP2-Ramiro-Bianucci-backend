import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { Publicacion, PublicacionSchema } from 'src/publicaciones/entities/publicacion.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule,
    // 🚀 ¡CLAVE! Registramos el esquema para que EstadisticasService lo pueda inyectar
    MongooseModule.forFeature([{ name: Publicacion.name, schema: PublicacionSchema }]),
  ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
})
export class EstadisticasModule {}
