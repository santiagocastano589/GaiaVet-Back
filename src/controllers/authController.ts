import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = "clavemamalona";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { cedula, nombre, apellido, correo, contraseña, direccion, telefono,estado } = req.body;

    if (!validateEmail(correo)) {
      return res.status(400).json({ message: 'Correo electrónico inválido' });
    }
    const newUser = await User.create({ cedula, nombre, apellido, correo, contraseña, direccion, telefono,estado });
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Error al registrar el Usuario' });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { correo, contraseña } = req.body;
    
    // Validar el formato del correo electrónico
    if (!validateEmail(correo)) {
      return res.status(400).json({ message: 'Correo electrónico inválido' });
    }

    // Buscar al usuario por correo electrónico en la base de datos
    const user = await User.findOne({ where: { correo } });

    // Si no se encuentra el usuario, devolver un error de usuario no encontrado
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);


    // Si las contraseñas no coinciden, devolver un error de contraseña incorrecta
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar un token JWT con la información del usuario que deseas incluir
    const token = jwt.sign({ cedula: user.cedula }, JWT_SECRET, { expiresIn: '1h' });

    // Configurar el token en el header de la respuesta
    res.setHeader('Authorization', `Bearer ${token}`);

    // Devolver una respuesta con el nombre del usuario u otra información relevante
    return res.status(200).json({ nombre: user.nombre , token:token});
  } catch (error) {
    console.error('Error al loguearse:', error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};