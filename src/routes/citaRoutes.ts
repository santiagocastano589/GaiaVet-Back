import { Router } from 'express';
import { accessRole, authenticate } from '../middlewares/authMiddlaware';

import { newCita,updateCitaEstado,getCitas, getUserAppointment, updateCita,AdminCita, GetAppointmentDate } from '../controllers/citaController';

const router = Router()

router.post('/newAppointment',authenticate,accessRole(['User','administrador','empleado']),newCita);
router.post('/updateDate/:id',authenticate,accessRole(['User','administrador','empleado']),updateCita);
router.put('/updateStatusAppointment/:id',authenticate,updateCitaEstado)
router.get('/getPendingAppointment',authenticate,accessRole(['administrador','empleado']),getCitas)
router.get('/getUserAppointment',authenticate,accessRole(['User']),getUserAppointment)
router.get('/GetAppointments/:fecha',authenticate,accessRole(['User','empleado','administrador']),GetAppointmentDate)
router.post('/newsAppointment',authenticate,accessRole(['administrador']),AdminCita);


export default router;