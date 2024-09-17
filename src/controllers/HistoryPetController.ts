import { Request, Response } from 'express';
import HistorialMedico from '../models/HistoryPetModel';

export const createHistoryPet = async (req: Request, res: Response) => {
  try {
    const { idMascotaH, encargadoAtencion, fechaCita, observaciones, valorCita } = req.body;
    const newHistorial = await HistorialMedico.create({
      idMascotaH,
      encargadoAtencion,
      fechaCita,
      observaciones,
      valorCita,
    });
    res.status(201).json({ message: 'Historial medico creado exitosamente', newHistorial});
  } catch (error) {
    res.status(500).json({ message: 'Error creando el historial médico', error });
  }
};

export const getHistoryPet = async (req: Request, res: Response) => {
  try {
    const historiales = await HistorialMedico.findAll();
    res.status(200).json(historiales);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo los historiales médicos', error });
  }
};

export const getHistoryPetById = async (req: Request, res: Response) => {
  try {
    const { idHistorial } = req.params;
    const historial = await HistorialMedico.findByPk(idHistorial);
    if (historial) {
      res.status(200).json(historial);
    } else {
      res.status(404).json({ message: 'Historial médico no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo el historial médico', error });
  }
};

export const updateHistoryPet = async (req: Request, res: Response) => {
  try {
    const { idHistorial } = req.params;
    const { idMascotaH, encargadoAtencion, fechaCita, observaciones, valorCita } = req.body;
    const [updated] = await HistorialMedico.update(
      { idMascotaH, encargadoAtencion, fechaCita, observaciones, valorCita },
      { where: { idHistorial } }
    );
    if (updated) {
      const updatedHistorial = await HistorialMedico.findByPk(idHistorial);
      res.status(200).json(updatedHistorial);
    } else {
      res.status(404).json({ message: 'Historial médico no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando el historial médico', error });
  }
};

export const deleteHistoryPet = async (req: Request, res: Response) => {
  try {
    const { idHistorial } = req.params;
    const deleted = await HistorialMedico.destroy({ where: { idHistorial } });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ message: 'Historial médico no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando el historial médico', error });
  }
};
