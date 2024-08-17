import { Router } from 'express';
import { createPet ,getAllPet,findPetsUser,updatePet, deletePet} from '../controllers/petControllers';
import { authenticate,accessRole } from '../middlewares/authMiddlaware';


const router = Router();

router.post('/newPet',authenticate, createPet);
router.get('/Pets',authenticate,accessRole('administrador'),getAllPet)
router.get('/Pet',authenticate,accessRole(['User']),findPetsUser)
router.put('/UpdatePet/:idMascota', authenticate, accessRole(['User', 'administrador']), updatePet);
router.put('/DeletePet',authenticate,accessRole(['User','administrador']),deletePet)
router.get('/PetsUser',authenticate,accessRole(['administrador','empleado']),getAllPet)

export default router;