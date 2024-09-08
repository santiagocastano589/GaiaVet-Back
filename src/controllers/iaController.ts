
import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GENERATION_CONFIG, START_CHAT} from '../config/config';

const genAI = new GoogleGenerativeAI("AIzaSyDfOsks6VfZYqJq_W_uxELGNUtsW5gcumk");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });




export const initChat = async (req: Request, res: Response) => {
  try {
    let history = req.body.history;
    let question = req.body.question;
    let historyChat = START_CHAT.concat(history)
    const chat = model.startChat({
      history: historyChat,
      generationConfig: GENERATION_CONFIG
    });
    const sendQuestion = await chat.sendMessage(question);
    const response = sendQuestion.response;
    const text = response.text();
    history.push({ role: "user", parts: question })
    history.push({ role: "model", parts: text })

    
    return res.status(200).json({ history: history });
  } catch (error) {
    console.error('Error al iniciar chat:', error);
    return res.status(500).json({ error: 'Error en la pregunta' });
  }
};


