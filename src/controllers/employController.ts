import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { validateEmail } from '../middlewares/authMiddlaware';
import Empleado from '../models/empleadoModel';



 
export const registerEmployee = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {cedulaEmpleado, nombre, apellido,edad,tiempoExp, correo, contraseña,role,estado } = req.body;
      if (!validateEmail(correo)) {
        return res.status(400).json({ message: 'Correo electrónico inválido' });
      }
      const exist = await Empleado.findOne({where: {[Op.or]: [{ correo },{ cedulaEmpleado }]}
      }); 
      if (!exist) {
        const newEmpleado= await Empleado.create({ cedulaEmpleado, nombre, apellido,edad,tiempoExp, correo, contraseña,role,estado });
        return res.status(201).json(newEmpleado);
      }else{
        return res.status(400).json({ message: 'Estos datos ya estan asociados a otra cuenta' });
      } 
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Error al registrar el Usuario' });
    }
  };