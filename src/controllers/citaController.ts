import Cita from "../models/citaModel";
import User from "../models/userModel";
import {CustomRequest} from '../middlewares/authMiddlaware'
import veterinaria from '../models/adminModel'
import { Request, Response } from 'express';
import { where } from "sequelize";

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
  export const updateCitaEstado = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { estadoCita } = req.body;

    try {
        const cita = await Cita.findByPk(id);

        if (!cita) {
            res.status(404).json({ message: 'Cita no encontrada' });
            return;
        }

        cita.estadoCita = estadoCita;
        await cita.save();

        res.status(200).json(cita);
    } catch (error) {
        console.error('Error al actualizar el estado de la cita:', error);
        res.status(500).json({ message: 'Error al actualizar el estado de la cita', error });
    }
};

export const getCitasPendientes = async (req: Request, res: Response): Promise<void> => {
  const { user } = req.body; // Obtén el filtro del cuerpo de la solicitud

  try {
      const whereClause: any = {
          estadoCita: 'Pendiente'
      };

      if (user) {
          whereClause.fk_cc_usuario = user;
      }

      // Buscar todas las citas con estado 'Pendiente' y filtradas por usuario si se proporciona
      const citasPendientes = await Cita.findAll({
          where: whereClause
      });

      // Verificar si se encontraron citas pendientes
      if (citasPendientes.length === 0) {
          res.status(404).json({ message: 'No se encontraron citas pendientes' });
          return;
      }

      res.status(200).json(citasPendientes);
  } catch (error) {
      console.error('Error al obtener las citas pendientes:', error);
      res.status(500).json({ message: 'Error al obtener las citas pendientes', error });
  }
};