import { Router } from "express";
import { initChat } from "../controllers/iaController";


const router = Router()

router.post("/chat",initChat);

export default router