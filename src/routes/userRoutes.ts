import { Router } from 'express';
import { getAllUsers, createUser, findOneUser, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

router.get('/usuarios', getAllUsers); // Ruta para obtener todos los usuarios
router.post('/usuarios', createUser); // Crear un usuario
router.get('/usuario/:cedula', findOneUser); // Buscar un usuario por cedula
router.put('/usuario/:cedula', updateUser); // Actualizar datos de un usuario
router.delete('/usuario/:cedula', deleteUser); // Eliminar un usuario

export default router;
