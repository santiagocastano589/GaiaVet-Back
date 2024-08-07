import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel'
import Empleado from '../models/empleadoModel';
import UserAttributes from '../models/userModel'

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
