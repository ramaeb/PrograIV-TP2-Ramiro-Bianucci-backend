import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://ramirobianucci_db_user:u3Y2nWujrrbUpaz0@bd-redsocial.gg111pi.mongodb.net/?appName=bd-redsocial'), AuthModule, UsuariosModule, PublicacionesModule, CloudinaryModule, EstadisticasModule,],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}