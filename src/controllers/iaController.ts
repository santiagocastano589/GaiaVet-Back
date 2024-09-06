import { GoogleGenerativeAI } from "@google/generative-ai";
import readline from 'readline';

const genAI = new GoogleGenerativeAI("AIzaSyBANwFDVPSfojzxW5SlmNNXrrj-lqPN_tQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const fs = require("fs");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function iaTexto() {
let respuesta:string = "";


  rl.question('Escribe tu prompt: ', async (pregunta) => {
    try {
      const result = await model.generateContent(pregunta);
      console.log('Respuesta:', result.response.text());
    } catch (error) {
      console.error('Error al generar contenido:', error);
    } finally {
      rl.close();
    }

  });
  
  
}




