import { Request, Response } from 'express';
import Mascota from '../models/petModel'
import {CustomRequest} from '../middlewares/authMiddlaware'
import User from '../models/userModel';
export const gmail = async (req:CustomRequest,res:Response):Promise<void>=>{
  const correo = req['user']['correo']
  const user = await User.findOne({ where: { correo: correo } });
  console.log(user);
  
}

export const getAllPet = async (req: Request, res: Response): Promise<void> => {
    try {
      const Pets = await Mascota.findAll({where:{Estado:true}});
      res.status(200).json(Pets); 
    } catch (error: any) {
      console.error('Error Al Buscar Las Mascotas: ', error);
      res.status(500).json({ message: 'No se pudo encontrar las mascotas' });
    }
  };

  export const createPet = async (req: CustomRequest, res: Response): Promise<void> => {
    const correo = req['user']['correo']
    const user = await User.findOne({ where: { correo: correo } });
  
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }   
    const cedula = user.cedula;
    try {
      const { nombre, edad, raza, peso, temperamento, foto,Estado,TipoMascota } = req.body;

      if (!nombre || !edad || !raza || !peso || !temperamento || !foto ) {
        res.status(400).json({message:'Error Campos vacios'})
        return
      }


      const fk_cedulaU = cedula+"";
      const newPet = await Mascota.create({ nombre, edad, raza, TipoMascota, peso, temperamento, foto, fk_cedulaU,Estado}); 
      res.status(201).json(newPet);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la mascota' });
    }
  };

  export const findPetsUser = async (req: CustomRequest, res: Response): Promise<void> => {
    const correo = req['user']['correo'];

    try {
      
      const user = await User.findOne({ where: { correo: correo } });
  
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
  
      const fk_cedulaU = user.cedula.toString();
  
      const pets = await Mascota.findAll({ where: { fk_cedulaU: fk_cedulaU,Estado:true }  });
  
      if (pets.length > 0) {
        res.status(200).json(pets);
      } else {
        res.status(404).json({ message: 'Mascota no encontrada' });
      }
    } catch (error: any) {
   console.error('Error fetching pet: ', error);
      res.status(500).json({ message: 'Error al encontrar la mascota.' });
    }
  };

  export const updatePet = async (req: Request, res: Response): Promise<void> => {
    const { idMascota } = req.params;
    const { nombre, edad, raza, peso, temperamento,foto ,TipoMascota } = req.body;
    
    if (!nombre || !edad || !raza || !peso || !temperamento || !foto ) {
      res.status(400).json({message:'Error Campos vacios'})
      return
    }

    try {
      const pet = await Mascota.findByPk(idMascota);
      
      if (pet) {
        await pet.update({
            nombre,
             edad,
              raza,
               TipoMascota,
                peso,
                 temperamento,
                  foto
        });
        const updatedPet= await Mascota.findByPk(idMascota);
        res.status(200).json(updatedPet);
      } else {
        res.status(404).json({ message: 'Mascota no encontrada' });
      }
    } catch (error: any) {
      console.error('Error updating mascota: ', error);
      res.status(500).json({ message: 'Error al actualizar' });
    }
  };
export const deletePet = async (req: Request, res: Response): Promise<void> => {
  const { idMascota } = req.params;

  try {
    const user = await Mascota.findByPk(idMascota);

    if (user) {
      await Mascota.update({ Estado: false }, { where: { idMascota } })
      res.status(200).json({ message: 'Macota eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Macota no encontrado' });
    }
  } catch (error: any) {
    console.error('Error deleting user: ', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

export const petsUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const cedula = req.body;
    const fk_cedulaU = cedula
    const pet = await Mascota.findAll({where:fk_cedulaU});
    if (pet) {
      res.status(200).json(pet); 
    } else {
      res.status(404).json({ message: 'Mascota no encontrada' }); 
    }
  } catch (error: any) {
    console.error('Error fetching pet: ', error);
    res.status(500).json({ message: 'Error al encontrar la mascota.' });
  }
};