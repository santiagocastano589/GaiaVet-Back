import bcrypt from 'bcrypt';
import Admin from '../models/adminModel';


export const authenticateAdministrador = async (correo: string, contraseña: string): Promise<Admin | null> => {
  const administrador = await Admin.findOne({ where: { correo } });
  if (administrador && await bcrypt.compare(contraseña, administrador.contraseña)) {
    return administrador;
  }
  return null;
};