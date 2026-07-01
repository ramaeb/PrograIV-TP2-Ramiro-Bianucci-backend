import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PublicacionDto {
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @IsString()
  @Length(3, 100, { message: 'El título debe tener entre 3 y 100 caracteres.' })
  titulo!: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @IsString()
  descripcion!: string;

  @IsNotEmpty({ message: 'El ID de usuario es obligatorio.' })
  @IsString()
  usuarioId!: string;

  @IsNotEmpty({ message: 'El autor es obligatorio.' })
  @IsString()
  autorUsuario!: string; 
}