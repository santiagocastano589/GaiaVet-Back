import { Router } from 'express';
import { getAllUsers, createUser, findOneUser, updateUser, me} from '../controllers/userController';
import { authenticate,CustomRequest } from '../middlewares/authMiddlaware';
import { loginUser } from '../controllers/authController';

const router = Router();

router.get('/usuarios', getAllUsers); // Ruta para obtener todos los usuarios
router.post('/register', createUser); // Crear un usuario
router.get('/usuario/:cedula', findOneUser); // Buscar un usuario por cedula
router.put('/usuario/:cedula', updateUser); // Actualizar un usuario por cédula

router.get('/me',authenticate, me );

export default router;
