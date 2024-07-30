import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "clavemamalona";


export interface CustomRequest extends Request {
    user?: any;
    
}export const accesRole = (role: string) => {
    return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const user = req.user;
        console.log(user);
        
        if (!user) {
          res.status(401).json({ message: 'No autorizado' });
          return; // Retorna para evitar que `next()` sea llamado
        }
  
        if (user.role !== role) {
          res.status(403).json({ message: 'Acceso denegado' });
          return; 
        }
        next();
      } catch (error) {
        console.error('Error en el middleware de acceso:', error);
        res.status(400).json({ message: 'Error al verificar permisos' });
      }
    };
  };

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido' });
        }
        req.user = user;
        
        next();
    });
};
