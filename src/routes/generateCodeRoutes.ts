import express from 'express';

import {solicitarCodigo, validarCodigo} from "../controllers/generateCodeController"


const router = express.Router();


router.post('/codigo', solicitarCodigo);
router.post('/vCodigo',validarCodigo)


export default router;
