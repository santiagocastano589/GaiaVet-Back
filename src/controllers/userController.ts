import { Request, Response } from 'express';
import User from '../models/userModel';
import {CustomRequest} from '../middlewares/authMiddlaware'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';



const JWT_SECRET = "clavemamalona";
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const me = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    const correo = req['user']['correo'];
    
    let user = await User.findOne({ where: { correo } });
    
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
    const { correo } = req.user; 
    const { nombre, apellido, contraseña, direccion, telefono, estado } = req.body;

    const user = await User.findOne({ where: { correo } });

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
