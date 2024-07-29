import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel'
import Empleado from '../models/empleadoModel';
import UserAttributes from '../models/userModel'

const JWT_SECRET = "clavemamalona";


export interface CustomRequest extends Request {
    user?: any;
    
}export const accesRole = (role: string) => {
    return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const user = req.user;
        console.log(user);
        
  
        // Verifica si `user` está definido y tiene el rol adecuado
        if (!user) {
          res.status(401).json({ message: 'No autorizado' });
          return; // Retorna para evitar que `next()` sea llamado
        }
  
        if (user.role !== role) {
          res.status(403).json({ message: 'Acceso denegado' });
          return; // Retorna para evitar que `next()` sea llamado
        }
  
        // Si el rol es correcto, pasa al siguiente middleware
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
