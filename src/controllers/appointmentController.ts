import { Request, Response } from 'express';
import Cita from '../models/citaModel';


export const createAppointment = async (req: Request, res: Response) => {
    const { tipoCita, fechaHoraCita, tipoMascota, estadoCita, fk_cc_usuario, fk_nit, fk_cc_Empleado } = req.body;

    try {
        const cita = await Cita.create({ tipoCita, fechaHoraCita, tipoMascota, estadoCita, fk_cc_usuario, fk_nit, fk_cc_Empleado });
        res.status(201).json(cita);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Error creating appointment', error });
    }
};


export const getAllApointments = async (req: Request, res: Response) => {
    try {
        const citas = await Cita.findAll();
        res.status(200).json(citas);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
};


export const getAppoinmentById = async (req: Request, res: Response) => {
    const { idCita } = req.params;

    try {
        const cita = await Cita.findByPk(idCita);
        if (!cita) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(cita);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ message: 'Error fetching appointment', error });
    }
};


export const updateAppointment = async (req: Request, res: Response) => {
    const { idCita } = req.params;
    const { tipoCita, fechaHoraCita, tipoMascota, estadoCita, fk_cc_usuario, fk_nit, fk_cc_Empleado } = req.body;

    try {
        const cita = await Cita.findByPk(idCita);
        if (!cita) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await cita.update({ tipoCita, fechaHoraCita, tipoMascota, estadoCita, fk_cc_usuario, fk_nit, fk_cc_Empleado });
        res.status(200).json(cita);
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Error updating appointment', error });
    }
};


export const deleteAppoinment = async (req: Request, res: Response) => {
    const { idCita } = req.params;

    try {
        const cita = await Cita.findByPk(idCita);
        if (!cita) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await cita.destroy();
        res.status(200).json({ message: 'Appointment deleted' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Error deleting appointment', error });
    }
};
