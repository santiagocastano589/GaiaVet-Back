import { Router } from 'express';
import { accessRole, authenticate } from '../middlewares/authMiddlaware';
import { createAdmin } from '../controllers/adminController';



const router = Router();

router.post('/registerAdmin',createAdmin)
export default router;