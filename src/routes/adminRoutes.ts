import { Router } from 'express';
import { registerEmpleado } from '../controllers/adminController';
import { accessRole, authenticate } from '../middlewares/authMiddlaware';



const router = Router();

router.post('/registerE',authenticate,accessRole('administrador'), registerEmpleado);


export default router;
