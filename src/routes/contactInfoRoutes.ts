import { Router } from "express";
import { contactInfo } from "../controllers/contactInfoController";


const router = Router()


router.post('/contact',contactInfo)

export default router;