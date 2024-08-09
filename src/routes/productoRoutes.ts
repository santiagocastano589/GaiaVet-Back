import { Router } from 'express';
import { createProducto, getProducts } from '../controllers/productoController';
import { authenticate, accessRole } from '../middlewares/authMiddlaware';

const router = Router();

router.post('/producto', authenticate, accessRole('administrador'), createProducto);
router.get('/products', getProducts);

export default router;
