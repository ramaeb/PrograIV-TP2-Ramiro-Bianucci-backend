import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsNotEmpty()
  @IsString()
  apellido!: string;

  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsEmail({}, { message: 'El formato del email es inválido.' })
  email!: string;

  @IsNotEmpty()
  fechaNacimiento!: string; // Llega como string del input date

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  perfil?: string; // "usuario" o admin

  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  clave!: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  imagenPerfil?: any; // test
}