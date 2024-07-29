import { Request, Response } from 'express';
import User from '../models/userModel';
import Empleado from '../models/empleadoModel';
import Admin from '../models/adminModel';

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

export const registerEmpleado = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { cedula, cedulaEmpleado, nombre, apellido,edad,tiempoExp, correo, contraseña,role } = req.body;
  
      if (!validateEmail(correo)) {
        return res.status(400).json({ message: 'Correo electrónico inválido' });
      }
      const newEmpleado= await Empleado.create({ cedulaEmpleado, nombre, apellido,edad,tiempoExp, correo, contraseña,role });
      return res.status(201).json(newEmpleado);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Error al registrar el Usuario' });
    }
  };


export const getAdministradores = async (req: Request, res: Response) => {
  try {
    const administradores = await Admin.findAll();
    res.json(administradores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener administradores' });
  }
};

export const createAdmin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nit, nombre, correo, contraseña,direccion,telefono,role } = req.body;

    if (!validateEmail(correo)) {
      return res.status(400).json({ message: 'Correo electrónico inválido' });
    }
    const newEmpleado= await Admin.create({ nit, nombre, correo, contraseña,direccion,telefono,role });
    return res.status(201).json(newEmpleado);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Error al registrar el Admin' });
  }
};