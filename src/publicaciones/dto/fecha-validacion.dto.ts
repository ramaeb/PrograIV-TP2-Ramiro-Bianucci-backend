import { IsNotEmpty, IsString } from 'class-validator';

export class FiltroFechaDto {
  @IsNotEmpty()
  @IsString()
  desde!: string; // Ejemplo: "2026-06-01"

  @IsNotEmpty()
  @IsString()
  hasta!: string; // Ejemplo: "2026-07-01"
}