import { Router } from 'express';
import { registerEmployee, getAllEmployees } from '../controllers/employController';
import { authenticate,accessRole } from '../middlewares/authMiddlaware';
const router = Router();


router.post('/registerE',authenticate,accessRole('administrador'),registerEmployee );
router.post('/employees',authenticate,accessRole('administrador'),getAllEmployees );
export default router;
