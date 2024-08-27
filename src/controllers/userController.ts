import { Request, Response } from 'express';
import User from '../models/userModel';
import {CustomRequest} from '../middlewares/authMiddlaware'
import bcrypt from 'bcrypt';
import { where } from 'sequelize';
import Admin from '../models/adminModel';
import { sendEmail } from './emailController';



const JWT_SECRET = "clavemamalona";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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
      const { cedula, nombre, apellido, correo, contraseña, direccion, telefono, estado, role } = req.body;
      const newUser = await User.create({ cedula, nombre, apellido, correo, contraseña, direccion, telefono,estado ,role });
      const emailRequest = {
        subject: 'Equipo gaiavet🐾',
        template: 'correo.html', 
        dataTemplate: { name: nombre },
        to: correo,
    };

    
    const request = {
        json: async () => emailRequest,
    } as any;

    const context = {} as any;

   
    const response = await sendEmail(request, context);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error); 
      res.status(400).json({ message: "Error al crear el Usuario" });
    }
  };
  
  export const findOneUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const cedula = req.body;
      const user = await User.findOne({where:cedula});
      if (user) {
        res.status(200).json(user); 
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' }); 
      }
    } catch (error: any) {
      console.error('Error fetching users: ', error);
      res.status(500).json({ message: 'Error al encontrar el usuario.' });
    }
  };
 

export const me = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    
    // El usuario decodificado del token está disponible en req['user']
    const correo = req['user']['correo'];

    let user = await User.findOne({ where: { correo } });


   
    // Buscar al usuario en la base de datos usando el campo único, como cédula en este caso

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
    const { correo } = req.user; // Obtener la cédula del usuario autenticado desde el token
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

