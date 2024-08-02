import { Response,Request } from "express";
import Cita from "../models/citaModel";

export const createAppointment = async (req:Request , res:Response) => {
    
    try {
        const appointment = await Cita.create(req.body)
        res.status(201).json(appointment)
        console.log('se creo la cita',appointment);
        
    } catch (error) {
            console.error('Error:', error); // Esto te dará más detalles en la consola
            res.status(500).json({ message: 'Error al crear la cita', error });
          
          
    }


}

export const updateAppointment = async (req:Request , res: Response) => {
    try {
        const {idCita} = req.params;
        const appointment = await Cita.findByPk(idCita)
        if (appointment) {
            await appointment.update(req.body);
            res.status(200).json(appointment)
        }else{
            res.status(404).json({message: 'Appoinment not found'})
        }
    } catch (error) {
      res.status(500).json({message: 'Error to update appointment',error})  
    }
}

export const deleteAppoinment = async (req:Request ,  res: Response) => {
    try {
        const {idCita} = req.params 
        const appointment = await Cita.findByPk(idCita)
        if (appointment) {
            await appointment.destroy()
            res.status(200).json({message: 'Appoinment eliminated'})
        }else{
            res.status(500).json({message: 'appoinment not found'})
        }
    } catch (error) {
        res.status(500).json({message:'Error to eliminated appointment',error})
    }
}

export const getAllApointments = async (req:Request, res:Response) => {
    try {
        const appointment = await Cita.findAll()
        res.status(200).json(appointment)
    } catch (error) {
        res.status(500).json({message:'Error to get appoinment',error})
    }
} 

export const getAppoinmentById = async (req:Request , res:Response) => {
    try {
        
        const {idCita} = req.params;
        const appointment = await Cita.findByPk(idCita)
        if (appointment) {
            res.status(200).json(appointment)
        }    
    } catch (error) {
        res.status(500).json({message:'Error to get appontment',error})
    }
}