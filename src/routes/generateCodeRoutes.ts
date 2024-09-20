import express from 'express';

import {solicitarCodigo, validarCodigo} from "../controllers/generateCodeController"


const router = express.Router();


router.post('/code', solicitarCodigo);
router.post('/vCode',validarCodigo)


export default router;