import { Router } from 'express';
import { createUser, updateUser, me,deleteAcount,registerUser,loginUser} from '../controllers/userController';
import { authenticate,CustomRequest } from '../middlewares/authMiddlaware';

const router = Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/register', createUser); // Crear un usuario
router.put('/usuario', authenticate, updateUser); // Actualizar un usuario autenticado
router.get('/me',authenticate, me );
router.delete('/me/deleteAcount',authenticate,deleteAcount)
export default router;
