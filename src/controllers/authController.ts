import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { cedula, nombre, apellido, correo, contraseña, direccion, telefono, estado } = req.body;
    const newUser = await User.create({ cedula, nombre, apellido, correo, contraseña, direccion, telefono, estado });

    if (!validator.isEmail(correo)) {
      return res.status(400).json({ message: 'Correo no válido' });
    }

   

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Error al registrar el Usuario' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { correo, contraseña } = req.body;
    const user = await User.findOne({ where: { correo } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!validator.isEmail(correo)) {
      return res.status(400).json({ message: 'Correo no válido' });
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
