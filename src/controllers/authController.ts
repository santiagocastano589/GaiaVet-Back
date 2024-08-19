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
import { promises } from 'dns';


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
    let isActive ;

    let user: AuthenticatedUser = await authenticateUser(correo, contraseña);
    let userType = 'user';
  if (user) {
    isActive= await validateStatus(correo,userType)
    console.log(isActive);
        

  }

    if (!user) {
      user = await authenticateEmpleado(correo, contraseña);
      userType = 'empleado';
      isActive= await validateStatus(correo,userType)
    }
    if (!user) {
      user = await authenticateAdministrador(correo, contraseña);
      userType = 'administrador';
      isActive= await validateStatus(correo,userType)

    }
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    if(!isActive){
      return res.status(404).json("Cuenta Desactivada")
    }
    console.log(isActive);
    
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
 export const validateStatus = async (correo: string,rol:string) => {
    console.log("pta vida");
    console.log(rol);
    
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
    
  
 
