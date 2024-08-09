import User  from '../models/userModel';
import bcrypt from 'bcrypt';

export const authenticateUser = async (correo: string, contraseña: string): Promise<User | null   > => {
  const user = await User.findOne({ where: { correo } });
  if (user) {
    if (user.estado == false) {
     
    }
  }
  if (user && await bcrypt.compare(contraseña, user.contraseña)) {
    return user;
  }
  return null;
};