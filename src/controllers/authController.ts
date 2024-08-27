import { Request, response, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Empleado from '../models/empleadoModel';
import Admin from '../models/adminModel';
import { promises } from 'dns';


dotenv.config();

const JWT_SECRET = "clavemamalona";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


type AuthenticatedUser = User | Empleado | Admin;
type AuthError = "Contraseña Incorrecta" | null;

export const authenticateUser = async (correo: string, contraseña: string): Promise<AuthenticatedUser | AuthError> => {
  const user = await User.findOne({ where: { correo } });

  if (user) {
    if (await bcrypt.compare(contraseña, user.contraseña)) {
      return user;
    } else {
      return "Contraseña Incorrecta";
    }
  }
  return null;
};

const authenticateEmpleado = async (correo: string, contraseña: string): Promise<AuthenticatedUser | AuthError> => {
  const empleado = await Empleado.findOne({ where: { correo } });

  if (empleado) {
    if (await bcrypt.compare(contraseña, empleado.contraseña)) {
      return empleado;
    } else {
      return "Contraseña Incorrecta";
    }
  }
  return null;
};

const authenticateAdministrador = async (correo: string, contraseña: string): Promise<AuthenticatedUser | AuthError> => {
  const admin = await Admin.findOne({ where: { correo } });

  if (admin) {
    if (await bcrypt.compare(contraseña, admin.contraseña)) {
      return admin;
    } else {
      return "Contraseña Incorrecta";
    }
  }
  return null;
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ message: 'Correo o contraseña vacíos' });
    }

    if (!validateEmail(correo)) {
      return res.status(400).json({ message: 'Correo electrónico inválido' });
    }

    let user: AuthenticatedUser | AuthError = await authenticateUser(correo, contraseña);
    let userType = 'user';

    if (user === "Contraseña Incorrecta") {
      return res.status(401).json({ message: 'Contraseña incorrecta para usuario' });
    }

    if (!user) {
      user = await authenticateEmpleado(correo, contraseña);
      userType = 'empleado';
      if (user === "Contraseña Incorrecta") {
        return res.status(401).json({ message: 'Contraseña incorrecta para empleado' });
      }
    }

    if (!user) {
      user = await authenticateAdministrador(correo, contraseña);
      userType = 'administrador';
      if (user === "Contraseña Incorrecta") {
        return res.status(401).json({ message: 'Contraseña incorrecta para administrador' });
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validar el estado del usuario
    const isActive = await validateStatus(correo, userType);
    if (!isActive) {
      return res.status(403).json({ message: 'Cuenta desactivada' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { correo: (user as any).correo, role: (user as any).role, userType },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(200).json({ nombre: (user as any).nombre, token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};
 export const validateStatus = async (correo: string,rol:string) => {   
    let user; 
    switch (rol) {
      case 'user':
        user = await User.findOne({ where: { correo } });
        console.log(correo);
        
        break;
      case 'administrador':
        user = await Admin.findOne({ where: { correo } });
        break;
      case 'empleado':
        user = await Empleado.findOne({ where: { correo } });
        break;
      default:
        return false;
    }

    if (user) {
      return user.estado;
    }
  
    
    return false
  };
    
  
 
