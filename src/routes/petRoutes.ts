import { Router } from 'express';
import { createPet } from '../controllers/petControllers';
import { authenticate } from '../middlewares/authMiddlaware';


const router = Router();

router.post('/newPet',authenticate, createPet)

export default router;
