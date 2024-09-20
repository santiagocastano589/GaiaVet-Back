import { Router, Request, Response } from 'express';
import { authenticate,CustomRequest, accessRole } from '../middlewares/authMiddlaware';
import { services } from '../controllers/citaController';


const router = Router();
router.post('/sellService', authenticate,accessRole('administrador'), services); 
 

export default routergit add .
