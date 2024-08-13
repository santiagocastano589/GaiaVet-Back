import { Request, response, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateAdministrador } from '../services/administradorService';
import { authenticateEmpleado } from '../services/empleadoService';
import { authenticateUser } from '../services/userService';
import Empleado from '../models/empleadoModel';
import Admin from '../models/adminModel';


dotenv.config();

const JWT_SECRET = "clavemamalona";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};




type AuthenticatedUser = User | Empleado |Admin | null ;

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { correo, contraseña } = req.body;
    if (!validateEmail(correo)) {
      return res.status(400).json({ message: 'Correo electrónico inválido' });
    }
    // const isActive = await validateStatus(correo);

    // if (!isActive) {
    //   return res.status(401).json({ message: 'Cuenta desactivada' });
    // }
    let user: AuthenticatedUser = await authenticateUser(correo, contraseña);
    let userType = 'user';
    if (!user) {
      user = await authenticateEmpleado(correo, contraseña);
      userType = 'empleado';
    }
    if (!user) {
      user = await authenticateAdministrador(correo, contraseña);
      userType = 'administrador';
    }
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const token = jwt.sign(
      { correo: user.correo, role: user.role, userType },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
 
    res.setHeader('Authorization', `Bearer ${token}`);

    return res.status(200).json({ nombre: user.nombre, token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};
// export const validateStatus = async (correo: string): Promise<boolean> => {
//   try {
//     const user = await User.findOne({ where: { correo } });

//     if (user) {
//       return user.estado !== false; // Retorna `true` si `estado` no es `false`, de lo contrario `false`
//     }
//     return false;
//   } catch (error) {
//     console.error('Error al verificar el estado del usuario:', error);
//     throw new Error('Error al verificar el estado del usuario');
//   }
// };
