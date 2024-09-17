import { Request, Response } from "express";
import { sendEmail } from "./emailController";


export const contactInfo = async (req: Request, res: Response) => {
    
    try {
        const { nombre, telefono, correo, asunto, mensaje } = req.body;
       
        const emailRequest = {
            subject: asunto,
            template: 'contacto.html', 
            dataTemplate: { name: nombre, telefono: telefono, correo: correo, asunto: asunto, mensaje: mensaje },
            to: "jhonedisonjurado59@gmail.com",  
        };

        const request = {
            json: async () => emailRequest,
        } as any;
    
        const context = {} as any;
       
        const response = await sendEmail(request,context); 
        
        if (response) {
            res.status(201).json("Contacto enviado correctamente");
        } else {
            throw new Error("Error al enviar el correo");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al enviar correo" });
    }
};
