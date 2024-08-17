import { Router } from 'express';
import {  updateUser, me, deleteAccount, createUser, getAllUsers, findOneUser} from '../controllers/userController';
import { authenticate,CustomRequest, accessRole } from '../middlewares/authMiddlaware';

const router = Router();

router.put('/user', authenticate, updateUser); 
router.get('/users',authenticate,accessRole('administrador'),getAllUsers)
router.get('/userFind/:cedula', authenticate, accessRole('administrador'), findOneUser);

router.get('/me',authenticate, me );
router.put('/me/deleteAccount',authenticate,deleteAccount)
router.post('/register',createUser)

export default router;
