import Cita from "../models/citaModel";
import User from "../models/userModel";
import {CustomRequest} from '../middlewares/authMiddlaware'
import { Request, Response } from 'express';
import Admin from "../models/adminModel";
import Mascota from "../models/petModel";
import moment from 'moment-business-days'; 
import { Op } from "sequelize";




export const newCita = async (req: CustomRequest, res: Response): Promise<void> => {
    const correo = req['user']['correo']
    const user = await User.findOne({ where: { correo: correo } });
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const { idCita,tipoCita, fechaHoraCita, tipoMascota, estadoCita,fk_id_mascota, fk_cc_Empleado } = req.body;

    try {
        const admin = await Admin.findByPk(159753);
        if (!admin) {
            res.status(404).json("Error")
            return
        }
        const fk_nit = admin?.nit

        const cita = await Cita.create({ idCita,tipoCita, fechaHoraCita, tipoMascota, estadoCita, fk_id_mascota, fk_nit, fk_cc_Empleado });
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

export const getCitas = async (req: Request, res: Response): Promise<void> => {
  const citasPendientes = await Cita.findAll();
  if (!citasPendientes) {
    res.status(404).json('No se encontraron citas')
  }
  };
 

  export const getUserAppointment = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const correo = req['user']['correo'];

    if (!correo) {
      res.status(404).json({ message: 'No se encontró el usuario'+correo });
      return
    }
    const user = await User.findOne({ where: { correo: correo } });

    if (!user) {
      res.status(404).json({ message: 'No se encontró el usuario' });
      return
      
    }
        const pets = await Mascota.findAll({where:{fk_cedulaU:user.cedula}})
        if (pets.length === 0) {
            res.status(404).json({ message: 'No se encontraron mascotas para el usuario' });
            return;
          }
    
        const idMascotas = pets.map(mascota => mascota.idMascota);
    
        const Appointment = await Cita.findAll({where:{fk_id_mascota:idMascotas}})
        if (Appointment.length === 0) {
            res.status(404).json({ message: 'No se encontraron citas para las mascotas del usuario' });
            return;
          }
   
  
    
      res.status(200).json(Appointment);
    } catch (error) {
      console.error('Error al obtener las citas pendientes:', error);
      res.status(500).json({ message: 'Error al obtener las citas pendientes', error });
    }
  };
  export const updateCita = async (req: CustomRequest, res: Response): Promise<void> => {
    const { idCita } = req.body;
    const { fechaHoraCita } = req.body;
  
    try {
      const cita = await Cita.findByPk(idCita);
      if (!cita) {
        res.status(404).json({ message: 'Cita no encontrada' });
        return;
      }
  
      const nuevaFecha = moment(fechaHoraCita);
      const hoy = moment();
  
      if (!nuevaFecha.isBusinessDay() || nuevaFecha.isSameOrBefore(hoy.businessAdd(2))) {
        res.status(400).json({
          message: 'La fecha debe ser al menos 2 días hábiles después de la fecha actual.',
        });
        return;
      }
        cita.fechaHoraCita = nuevaFecha.toDate();
      await cita.save();
  
      res.status(200).json({ message: 'Fecha de la cita actualizada correctamente', cita });
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
      res.status(500).json({ message: 'Error al actualizar la cita', error });
    }
  };



  export const AppointmentDate = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener la fecha del parámetro en la URL
      const { fecha } = req.params;

  res.status(200).json(fecha.toString + "Jola")      // Convertir la fecha a un objeto Date
      // const date = new Date(fecha);
  
      // // Asegurarse de que la fecha es válida
      // if (isNaN(date.getTime())) {
      //   res.status(400).json({ error: 'Fecha inválida.' });
      //   return;
      // }
  
      // // Buscar citas para la fecha dada (solo el día específico)
      // const citas = await Cita.findAll({
      //   where: {
      //     fechaHoraCita: {
      //       [Op.eq]: date // Filtrar citas en la fecha exacta
      //     }
      //   }
      // });
  
      // res.status(200).json(citas);
    } catch (error) {
      console.error('Error al obtener citas:', error);
      res.status(500).json({ error: 'Error al obtener citas' });
    }
  };