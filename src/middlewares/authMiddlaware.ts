import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { where } from 'sequelize';
import User from '../models/userModel';

const JWT_SECRET = "clavemamalona";

export interface CustomRequest extends Request {
    user?: any;
}

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

export const accessRole = (roles: string | string[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ message: 'No autorizado' });
        return;
      }
      const roleArray = Array.isArray(roles) ? roles : [roles];
      if (!roleArray.includes(user.role)) {
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

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

