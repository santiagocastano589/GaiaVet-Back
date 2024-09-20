import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import { sendEmail } from './emailController';
import User from '../models/userModel';


export const codigosTemporales: { [key: string]: { codigo: string; correo: string; expiracion: number } } = {};

const generarCodigo = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const enviarCodigo = async (correo: string, codigo: string, nombre: string) => {
    const EmailRequest = {
        subject: 'Código de recuperación',
        template: 'codigo.html', 
        dataTemplate: {
            name: nombre, 
            asunto: 'Recuperación de Contraseña',
            codigo , 
        },
        to: correo,
    };

  
    const fakeRequest = {
        json: async () => EmailRequest,
    } as any;

    const context = {} as any; 

    
    await sendEmail(fakeRequest, context);
};

const solicitarCodigo = async (req: Request, res: Response) => {
    const { correo } = req.body;

    try {
        
        const usuario = await User.findOne({ where: { correo } });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const codigo = generarCodigo();
        const expiracion = Date.now() + 10 * 60 * 1000; // 10 minutos
        codigosTemporales[codigo] = { codigo, correo, expiracion };

       
        await enviarCodigo(correo, codigo, usuario.nombre); 

        res.status(200).json({ message: 'Código enviado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const validarCodigo = (req: Request, res: Response) => {
    const { correo, codigoIngresado } = req.body;

    try {
        // Verificar si hay un código temporal para el correo proporcionado
        const codigoTemporal = Object.values(codigosTemporales).find(entry => entry.correo === correo && entry.codigo === codigoIngresado);

        if (!codigoTemporal) {
            return res.status(400).json({ message: 'Código inválido o no encontrado' });
        }

        // Verificar que el código no haya expirado
        if (codigoTemporal.expiracion < Date.now()) {
            return res.status(400).json({ message: 'El código ha expirado' });
        }

        // Si es válido
        res.status(200).json({ message: 'Código válido' });

        // Opcional: Eliminar el código temporal una vez validado
        delete codigosTemporales[codigoTemporal.codigo];

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
export {solicitarCodigo , validarCodigo}