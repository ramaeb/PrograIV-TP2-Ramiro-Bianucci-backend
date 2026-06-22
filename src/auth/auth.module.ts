import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsuariosModule],
})
export class AuthModule {}
