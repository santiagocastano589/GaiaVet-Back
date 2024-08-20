import { Router } from 'express';
import { createProducto, getProducts, updateProducto, deleteProducto, preferences_ } from '../controllers/productoController';
import { authenticate, accessRole } from '../middlewares/authMiddlaware';

const router = Router();

router.post('/producto', authenticate, accessRole('administrador'), createProducto);
router.get('/products', getProducts);
router.put('/producto/:idProducto', authenticate, accessRole('administrador'), updateProducto);
router.delete('/producto/:idProducto', authenticate, accessRole('administrador'), deleteProducto);
router.post('/create_preference', authenticate, accessRole('User'), preferences_);

export default router;
