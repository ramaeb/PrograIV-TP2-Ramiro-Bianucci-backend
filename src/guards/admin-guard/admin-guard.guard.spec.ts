import { AdminGuard } from './admin-guard.guard';

describe('AdminGuard', () => {
  it('should be defined', () => {
    // 🚀 Creamos un objeto falso básico para cumplir con el constructor sin levantar NestJS
    const mockJwtService = {} as any; 
    
    // Se lo pasamos por parámetro y listo el pollo
    expect(new AdminGuard(mockJwtService)).toBeDefined();
  });
});