import { Router } from "express";
import { recuperarContraseña } from "../controllers/forgotPasswordController";

const router = Router();


router.post('/password', recuperarContraseña);

export default router;