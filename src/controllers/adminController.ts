import { Request, Response } from 'express';
import Empleado from '../models/empleadoModel';
import Admin from '../models/adminModel';

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  export const createAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nit, nombre, correo, contraseña, direccion, telefono, role,estado } = req.body;
      // const exist = await Admin.findOne({ where: { [Op.or]: [ { correo }, { cedula } ] } });
      
      // if (!exist) {
      //   res.status(201).json(newUser);
      // } else {
      //   res.status(400).json({ message: "Estos datos ya están asociados a otra cuenta" });
      // }
      const newUser = await Admin.create({ nit, nombre, correo, contraseña, direccion, telefono, role,estado });
      res.status(200).json(newUser);
      

    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error al crear el Usuario" });
    }
  };
