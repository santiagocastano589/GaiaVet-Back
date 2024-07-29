import { Router } from 'express';
import { registerEmpleado } from '../controllers/adminController';
import { accesRole, authenticate } from '../middlewares/authMiddlaware';



const router = Router();

router.post('/registrar',authenticate,accesRole('administrador'), registerEmpleado);


export default router;
