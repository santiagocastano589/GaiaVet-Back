import { Router } from 'express';
import { createHistoryPet, getHistoryPet, getHistoryPetById, updateHistoryPet, deleteHistoryPet} from '../controllers/HistoryPetController';
import { authenticate,accessRole } from '../middlewares/authMiddlaware';

const router = Router();

router.post('/createHistoryPet',authenticate, accessRole(['User', 'administrador']), createHistoryPet);
router.get('/historyPets',authenticate,accessRole('administrador'), getHistoryPet);
router.get('/findHistoryPet/:idHistorial',authenticate, accessRole(['User', 'administrador']), getHistoryPetById);
router.put('/updateHistory/:idHistorial',authenticate, accessRole(['User', 'administrador']), updateHistoryPet);
router.delete('/deleteHistory/:idHistorial',authenticate, accessRole(['User', 'administrador']), deleteHistoryPet);

export default router;
