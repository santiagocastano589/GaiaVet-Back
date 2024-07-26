import { Router } from 'express';
import { registerEmpleado } from '../controllers/adminController';



const router = Router();

router.post('/registrar/Empleado', registerEmpleado);


export default router;
