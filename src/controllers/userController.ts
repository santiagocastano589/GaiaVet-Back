import { Request, Response } from 'express';
import User from '../models/userModel';





export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.findAll();
      res.status(200).json(users); 
    } catch (error: any) {
      console.error('Error fetching users: ', error);
      res.status(500).json({ message: 'Error fetching users.' });      
    }
  };


  export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cedula, nombre, apellido, correo, contraseña, direccion, telefono, estado } = req.body;
      const newUser = await User.create({ cedula, nombre, apellido, correo, contraseña, direccion, telefono,estado  });
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error); 
      res.status(400).json({ message: "Error al crear el Usuario" });
    }
  };
  
  export const findOneUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const cedula = req.body;
      const user = await User.findOne({where:cedula});
      if (user) {
        res.status(200).json(user); 
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' }); 
      }
    } catch (error: any) {
      console.error('Error fetching users: ', error);
      res.status(500).json({ message: 'Error al encontrar el usuario.' });
    }
  };

  export const updateUser = async (req: Request, res: Response): Promise<void> => {

    if ((req as any).session.user) {

      const { cedula } = req.params;
      const { nombre, apellido, correo, contraseña, direccion, telefono } = req.body;
    
      try {
        const user = await User.findByPk(cedula);
    
        if (user) {
          await user.update({
            nombre,
            apellido,
            correo,
            contraseña,
            direccion,
            telefono,
          });
    
          const updatedUser = await User.findByPk(cedula);
          res.status(200).json(updatedUser);
        } else {
          res.status(404).json({ message: 'Usuario no encontrado' });
        }
      } catch (error: any) {
        console.error('Error updating user: ', error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
      }

      
    }else{
      res.status(404).json({message:"ERROR"})
    }
  };
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { cedula } = req.params;

  try {
    const user = await User.findByPk(cedula);

    if (user) {
      await user.update({estado:false});
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error: any) {
    console.error('Error deleting user: ', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

;

export const me = async (req: Request, res: Response): Promise<Response> => {
  try {
    
    // El usuario decodificado del token está disponible en req['user']
    const cedula = req['user']['cedula'];

    // Buscar al usuario en la base de datos usando el campo único, como cédula en este caso
    const user = await User.findOne({ where: { cedula } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ nombre: user.nombre, apellido: user.apellido, correo: user.correo });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

