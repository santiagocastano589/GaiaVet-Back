import { Router } from 'express';
import {  updateUser, me,deleteAcount} from '../controllers/userController';
import { authenticate,CustomRequest } from '../middlewares/authMiddlaware';

const router = Router();

router.put('/user', authenticate, updateUser); 
router.get('/me',authenticate, me );
router.put('/me/deleteAcount',authenticate,deleteAcount)
export default router;
