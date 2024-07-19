import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { cedula, nombre, apellido, correo, contraseña, direccion, telefono } = req.body;

    if (!validateEmail(correo)) {
      return res.status(400).json({ message: 'Correo electrónico inválido' });
    }

   
    const newUser = await User.create({ cedula, nombre, apellido, correo, contraseña, direccion, telefono });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Error al registrar el Usuario' });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { correo, contraseña } = req.body;

    if (!validateEmail(correo)) {
      return res.status(400).json({ message: 'Correo electrónico inválido' });
    }

    const user = await User.findOne({ where: { correo } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ cedula: user.cedula }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error al loguearse: ', error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

