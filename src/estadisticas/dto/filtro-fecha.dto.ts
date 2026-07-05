import { IsDateString, IsNotEmpty } from 'class-validator';

export class FiltroFechaDto {
  @IsNotEmpty()
  @IsDateString()
  fechaInicio!: string;

  @IsNotEmpty()
  @IsDateString()
  fechaFin!: string;
}