import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel';

const recuperarContraseña = async (req: Request, res: Response) => {
   
    const { nuevaContraseña, confirmarContraseña, cedula } = req.body;

    
    if (nuevaContraseña !== confirmarContraseña) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }


    try {
        
        const usuario = await User.findOne({ where: { cedula } });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

       
        usuario.contraseña = await bcrypt.hash(nuevaContraseña, 10);
        await usuario.save();

        
        res.status(200).json({ message: 'Contraseña actualizada correctamente' });

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export { recuperarContraseña };