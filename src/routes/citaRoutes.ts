import { Router } from 'express';
import { newCita } from '../controllers/citaController';

const router = Router()

router.post('/newCita',newCita)