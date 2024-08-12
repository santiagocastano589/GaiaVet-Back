import { Router } from 'express';
import { createPet ,getAllPet,findPetsUser,updatePet} from '../controllers/petControllers';
import { authenticate,accessRole } from '../middlewares/authMiddlaware';


const router = Router();

router.post('/newPet',authenticate, createPet);
router.get('/Pets',authenticate,accessRole(['empleado']),getAllPet);
router.get('/userPets',authenticate,accessRole('user'),findPetsUser);
router.put('/UpdatePet',authenticate,accessRole(['user','administrador']),updatePet);


export default router;
