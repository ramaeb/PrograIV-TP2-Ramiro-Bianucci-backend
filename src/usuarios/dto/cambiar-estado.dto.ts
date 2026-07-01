import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CambiarEstadoDto {
  @IsNotEmpty()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano.' })
  activo!: boolean;
}