import User  from '../models/userModel';
import bcrypt from 'bcrypt';

export const authenticateUser = async (correo: string, contraseña: string): Promise<User | null | string   > => {
  const user = await User.findOne({ where: { correo } });  

  if (user) {
    if (await bcrypt.compare(contraseña, user.contraseña)) {
      return user
    }else{
      return "Contraseña Incorrecta"
    }
   
    
  }
  return null;
};

