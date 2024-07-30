import { Request, Response } from 'express';
import Empleado from '../models/empleadoModel';
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

export const registerEmpleado = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {cedulaEmpleado, nombre, apellido,edad,tiempoExp, correo, contraseña,role } = req.body;
  
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