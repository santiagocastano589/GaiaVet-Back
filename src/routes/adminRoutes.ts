import { Router } from 'express';
import { registerEmpleado , getAdministradores,createAdmin} from '../controllers/adminController';
import { authRole,authenticate } from '../middlewares/authMiddlaware';




const router = Router();

router.post('/registrar/Empleado',authenticate,authRole(['Administrador']), registerEmpleado);
router.get('/all',getAdministradores);
router.get('/create',createAdmin);



export default router;
