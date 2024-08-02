import { Router } from 'express';
import { registerEmployee } from '../controllers/employController';
import { authenticate,accessRole } from '../middlewares/authMiddlaware';
const router = Router();


router.post('/registerE',authenticate,accessRole('administrador'),registerEmployee );
export default router;
