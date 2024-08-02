import {Router} from 'express'
import {createAppointment,deleteAppoinment,updateAppointment,getAllApointments,getAppoinmentById} from '../controllers/appointmentController'

const router = Router();

router.post('/cita',createAppointment);
router.get('/citas',getAllApointments);
router.get('/cita/:idCita',getAppoinmentById);
router.put('/cita/:idCita',updateAppointment)
router.delete('/cita/:idCita',deleteAppoinment);

export default router;