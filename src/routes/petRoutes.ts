import { Router } from 'express';
import { createPet ,getAllPet,findPetsUser,updatePet} from '../controllers/petControllers';
import { authenticate,accessRole } from '../middlewares/authMiddlaware';


const router = Router();

router.post('/newPet',authenticate, createPet);
<<<<<<< HEAD
router.get('/Pets',authenticate,accessRole(['empleado']),getAllPet);
router.get('/userPets',authenticate,accessRole('user'),findPetsUser);
router.put('/UpdatePet',authenticate,accessRole(['user','administrador']),updatePet);

=======
router.get('/Pets',authenticate,accessRole('administrador'),getAllPet)
router.get('/Pet',authenticate,accessRole(['User']),findPetsUser)
router.put('/UpdatePet',authenticate,accessRole(['User','administrador']),updatePet)
router.get('/PetsUser',authenticate,accessRole(['administrador','empleado']),getAllPet)
>>>>>>> 52884eec3484eab4757193c3d01e4c4a38720761

export default router;
