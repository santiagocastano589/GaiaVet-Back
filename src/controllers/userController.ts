import { Request, Response } from 'express';
import User from '../models/userModel';
import {CustomRequest, validateEmail} from '../middlewares/authMiddlaware'
import bcrypt from 'bcrypt';
import { where } from 'sequelize';
import Admin from '../models/adminModel';
import { Op } from 'sequelize';
import { sendEmail } from './emailController';

const JWT_SECRET = "clavemamalona";




export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.findAll();
      res.status(200).json(users); 
    } catch (error: any) {
      console.error('Error fetching users: ', error);
      res.status(500).json({ message: 'Error fetching users.' });      
    }
  };


  export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cedula, nombre, apellido, correo, contraseña, direccion, telefono, estado, role, imagen } = req.body;
      const exist = await User.findOne({ where: { [Op.or]: [{ correo }, { cedula }] } });
  
      if (!exist) {
        const newUser = await User.create({ cedula, nombre, apellido, correo, contraseña, direccion, telefono, estado, role, imagen });
  
        const emailRequest = {
          subject: 'Bienvenido a Gaiavet🐾',
          template: 'correo.html',
          dataTemplate: { name: nombre },
          to: correo,
        };
        const request = {
          json: async () => emailRequest,
        } as any;
  
        const context = {} as any;
  
        const response = await sendEmail(request, context);
        console.log(`Email enviado: ${response.body}`);
  
        res.status(201).json(newUser);
      } else {
        res.status(400).json({ message: "Estos datos ya están asociados a otra cuenta" });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error al crear el Usuario" });
    }
  };

  export const findOneUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cedula } = req.params;
      const user = await User.findOne({ where: { cedula } });
      if (user) {
        res.status(200).json(user); 
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' }); 
      }
    } catch (error: any) {
      console.error('Error fetching user: ', error);
      res.status(500).json({ message: 'Error al encontrar el usuario.' });
    }
  };
     
export const me = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    const correo = req['user']['correo'];
    
    let user = await User.findOne({ where: { correo } });

    if (!user) {return res.status(404).json({ message: 'Usuario no encontrado' });}
    return res.status(200).json({ nombre: user.nombre, apellido: user.apellido, correo: user.correo, direccion:user.direccion, telefono:user.telefono, imagen: user.imagen });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return res.status(500).json({ message: 'Error al obtener usuario' });
  }
};
export const updateUser = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    const { correo } = req.user; 
    const { nombre, apellido, contraseña, direccion, telefono, estado, imagen } = req.body;

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
      if (contraseña.length < 6) { 
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
      }
      const salt = await bcrypt.genSalt(10);
      user.contraseña = await bcrypt.hash(contraseña, salt);
    }
    if (direccion) user.direccion = direccion;
    if (telefono) user.telefono = telefono;
    if (typeof estado === 'boolean') user.estado = estado;
    if (imagen) user.imagen = imagen; 

    await user.save();

    return res.status(200).json({ message: 'Usuario actualizado correctamente', user });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};


export const deleteAccount = async (req: CustomRequest, res: Response): Promise<Response<any>> => {
  const correo = req['user']['correo'];

  try {
    const user = await User.findOne({ where: { correo } });

    if (user) {
      await User.update({ estado: false }, { where: { cedula: user.cedula } });
      return res.status(200).json({ message: 'Usuario Eliminado' }); 
    }

    // Si no se encuentra el usuario, envía la respuesta 404
    return res.status(404).json({ message: 'Usuario no encontrado' });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ error: 'Error al eliminar usuario' }); 
  }
};
