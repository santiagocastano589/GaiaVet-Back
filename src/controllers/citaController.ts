import Cita from "../models/citaModel";
import User from "../models/userModel";
import {CustomRequest} from '../middlewares/authMiddlaware'
import veterinaria from '../models/adminModel'
import { Request, Response } from 'express';

export const newCita = async (req: CustomRequest, res: Response): Promise<void> => {
    const correo = req['user']['correo']
    const user = await User.findOne({ where: { correo: correo } });
  
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }   
    const cedula = user.cedula;
    const fk_cc_usuario = cedula.toString();
    const { idCita,tipoCita, fechaHoraCita, tipoMascota, estadoCita, fk_nit, fk_cc_Empleado } = req.body;

    try {
        const cita = await Cita.create({ idCita,tipoCita, fechaHoraCita, tipoMascota, estadoCita, fk_cc_usuario, fk_nit, fk_cc_Empleado });
        res.status(201).json(cita);
    } catch (error) {
        console.error('Error al crear la cita:', error);
        res.status(500).json({ message: 'Error al crear la cita', error });
    }
  };
