import { Router } from 'express';
import {  updateUser, me,deleteAcount,createUser} from '../controllers/userController';
import { authenticate,CustomRequest } from '../middlewares/authMiddlaware';

const router = Router();

router.put('/user', authenticate, updateUser); 
router.get('/me',authenticate, me );
router.delete('/me/deleteAcount',authenticate,deleteAcount)
router.post('/register', createUser );

export default router;
