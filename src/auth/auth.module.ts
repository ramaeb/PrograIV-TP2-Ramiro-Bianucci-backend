import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsuariosModule, JwtModule.register({
      global: true, 
      secret: 'To16bit', 
      signOptions: { expiresIn: '2min' }, // 2 minutos exp
    }),
  ],
})
export class AuthModule {}
