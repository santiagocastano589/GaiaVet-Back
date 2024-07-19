import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato del token: Bearer <token>

  if (token == null) {
    return res.sendStatus(401); // Unauthorized si no hay token
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Error al verificar token:', err);
      return res.sendStatus(403); // Forbidden si el token no es válido
    }
    (req as any).user = user;
    next(); // Pasar al siguiente middleware o controlador
  });
};
