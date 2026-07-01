import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CambiarEstadoDto {
  @IsNotEmpty()
  @Transform(({ value }) => value === true || value === 'true') // Convierte explícitamente cualquier entrada a booleano nativo
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano.' })
  activo!: boolean;
}