import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'clavemamalona';

interface JwtPayload {
  cedula: string;
  role: string;
}

interface CustomRequest extends Request {
  user?: JwtPayload;
}

export const authRole = (allowedRoles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No proporcionó el token' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      if (allowedRoles.includes(decoded.role)) {
        req.user = decoded;
        next();
      } else {
        res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions' });
      }
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
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

    req.user = user as JwtPayload;
    next();
  });
};
