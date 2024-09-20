import { Router, Request, Response } from 'express';
import { authenticate,CustomRequest, accessRole } from '../middlewares/authMiddlaware';
import { services } from '../controllers/citaController';


const router = Router();
router.put('/sellService', authenticate,accessRole('administrador'), services); 
 

export default router