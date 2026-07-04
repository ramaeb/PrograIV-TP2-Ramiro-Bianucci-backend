// src/auth/interfaces/jwt-payload.interface.ts
export interface JwtPayload {
  sub: string;       // Aquí va el UUID del usuario
  username: string;
  email: string;
  perfil: 'user' | 'admin';
}