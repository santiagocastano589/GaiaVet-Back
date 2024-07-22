import { Request, Response } from 'express';
import User from '../models/userModel';
import {CustomRequest} from '../middlewares/authMiddlaware'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { where } from 'sequelize';
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

    res.setHeader('Authorization', `Bearer ${token}`);

    return res.status(200).json({ nombre: user.nombre , token:token});
  } catch (error) {
    console.error('Error al loguearse:', error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cedula, nombre, apellido, correo, contraseña, direccion, telefono, estado } = req.body;

    // Verificar si ya existe un usuario con la misma cédula y estado false
    const user = await User.findOne({ where: { cedula: cedula, estado: false } });

    if (user) {
      // Si encontramos un usuario con la misma cédula y estado false, respondemos con un mensaje
      console.log(`Ya existe un usuario con cédula ${cedula} y estado false.`);
      res.status(400).json({ message: 'Ya existe un usuario con esta cédula y estado inactivo.' });
    } else {
      // Si no encontramos un usuario, creamos uno nuevo
      const newUser = await User.create({ cedula, nombre, apellido, correo, contraseña, direccion, telefono, estado });
      res.status(201).json(newUser); // Devolvemos el usuario creado con código de estado 201 (Created)
    }
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error al crear el usuario.' });
  }
};
export const me = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    
    // El usuario decodificado del token está disponible en req['user']
    const cedula = req['user']['cedula'];

    // Buscar al usuario en la base de datos usando el campo único, como cédula en este caso
    const user = await User.findOne({ where: { cedula } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ nombre: user.nombre, apellido: user.apellido, correo: user.correo, direccion:user.direccion, telefono:user.telefono });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return res.status(500).json({ message: 'Error al obtener usuario' });
  }
};
export const updateUser = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    const { cedula } = req.user; // Obtener la cédula del usuario autenticado desde el token
    const { nombre, apellido, correo, contraseña, direccion, telefono, estado } = req.body;

    const user = await User.findOne({ where: { cedula } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (correo && !validateEmail(correo)) {
      return res.status(400).json({ message: 'Correo electrónico inválido' });
    }

    if (nombre) user.nombre = nombre;
    if (apellido) user.apellido = apellido;
    if (correo) user.correo = correo;
    if (contraseña) {
      const salt = await bcrypt.genSalt(10);
      user.contraseña = await bcrypt.hash(contraseña, salt);
    }
    if (direccion) user.direccion = direccion;
    if (telefono) user.telefono = telefono;
    if (typeof estado === 'boolean') user.estado = estado;

    await user.save();

    return res.status(200).json({ message: 'Usuario actualizado correctamente', user });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};
export const deleteAcount = async (req: CustomRequest, res: Response): Promise<void> => {
  const cedula = req['user']['cedula'];

  try {
    const result = await User.update({estado:false},{
      where: {cedula}
    });

    res.status(200).json({ message: 'Usuario Eliminado' });
  } catch (error) {
    console.error('Error al eliminar usuarios:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
}
