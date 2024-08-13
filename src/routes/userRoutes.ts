import { Router } from 'express';
import {  updateUser, me,deleteAccount,createUser} from '../controllers/userController';
import { authenticate,CustomRequest } from '../middlewares/authMiddlaware';

const router = Router();

router.put('/user', authenticate, updateUser); 
router.get('/me',authenticate, me );
router.put('/me/deleteAccount',authenticate,deleteAccount)
router.post('/register',createUser)

export default router;
