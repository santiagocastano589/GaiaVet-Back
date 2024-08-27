import { Router } from 'express';
import { newCita,updateCitaEstado,getCitasPendientes } from '../controllers/citaController';

const router = Router()

router.post('/newCita',newCita)
router.put('/updateCitaEstado',updateCitaEstado)
router.get('/getCitasPendientes',getCitasPendientes)
export default router;