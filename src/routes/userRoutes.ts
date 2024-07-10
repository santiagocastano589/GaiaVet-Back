import { Router } from 'express';
import { getAllUsers,createUser,findOneUser,updateUser,deleteUser } from '../controllers/userController';

const router = Router();

router.get('/usuarios', getAllUsers);// Ruta para obtener todos los usuarios
router.post('/usuarios',createUser) // Crear un usuario
router.post('/usuario/buscar',findOneUser) // Crear un usuario
router.post('/usuario/actualizarDatos/:cedula',updateUser)// Acualizar Datos De Un Usuario xd
router.post('/usuario/eliminarUsuario/:cedula',deleteUser) //Eliminar Un Usuario :D

export default router;

