import { Router } from "express";

import { createProduct,deleteProduct,updateProduct,getAllProducts,getProductsById } from "../controllers/productController";

const router = Router()

router.post('/producto',createProduct);
router.put('/producto/:idProducto',updateProduct)
router.delete('/producto/:idProducto',deleteProduct)
router.get('/productos',getAllProducts)
router.get('/producto/:idProducto',getProductsById)

export default router;