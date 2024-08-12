import  Empleado  from '../models/empleadoModel';
import bcrypt from 'bcrypt';

export const authenticateEmpleado = async (correo: string, contraseña: string): Promise<Empleado | null> => {
  const empleado = await Empleado.findOne({ where: { correo } });
  
  if (empleado && await bcrypt.compare(contraseña, empleado.contraseña)) {
    return empleado;
  }
  return null;
};