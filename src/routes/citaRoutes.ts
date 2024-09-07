import { Router } from 'express';
import { accessRole, authenticate } from '../middlewares/authMiddlaware';

import { newCita,updateCitaEstado,getCitasPendientes, getUserAppointment, updateCita } from '../controllers/citaController';

const router = Router()

router.post('/newAppointment',authenticate,accessRole(['User','administrador','empleado']),newCita);
router.post('/updateDate',authenticate,accessRole(['User','administrador','empleado']),updateCita);
router.put('/updateStatusAppointment',authenticate,accessRole(['administrador','empleado']),updateCitaEstado)
router.get('/getPendingAppointment',authenticate,accessRole(['administrador','empleado']),getCitasPendientes)
router.get('/getUserAppointment',authenticate,accessRole(['User']),getUserAppointment)

export default router;