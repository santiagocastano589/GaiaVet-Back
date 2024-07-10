import { Request, Response } from 'express';
import Pet from '../models/petModel'

export const getAllPet = async (req: Request, res: Response): Promise<void> => {
    try {
      const Pets = await Pet.findAll();
      res.status(200).json(Pets); 
    } catch (error: any) {
      console.error('Error fetching users: ', error);
      res.status(500).json({ message: 'No se pudo encontrar las mascotas' });
    }
  };

  
  export const createPet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idMascota,nombre, edad, raza, peso, temperamento,foto, fk_cedulaU } = req.body;
      const newPet = await Pet.create({ idMascota,  nombre, edad, raza, peso, temperamento,foto, fk_cedulaU });
      res.status(201).json(newPet);
    } catch (error) {
      console.error(error); 
      res.status(400).json({ message: "Error al crear la mascota" });
    }
  };
  

  export const findOnePet = async (req: Request, res: Response): Promise<void> => {
    try {
      const fk_cedulaU = req.body;
      const pet = await Pet.findOne({where:fk_cedulaU});
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

  export const updatePet = async (req: Request, res: Response): Promise<void> => {
    const { idMascota } = req.params;
    const { nombre, edad, raza, peso, temperamento,foto  } = req.body;
  
    try {
      const pet = await Pet.findByPk(idMascota);
  
      if (pet) {
        await pet.update({
            nombre,
             edad,
              raza,
               peso,
                temperamento,
                foto
                  
        });
  
        const updatedPet= await Pet.findByPk(idMascota);
        res.status(200).json(updatePet);
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
    const user = await Pet.findByPk(idMascota);

    if (user) {
      await pet.update({estado:false});
      res.status(200).json({ message: 'Macota eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Macota no encontrado' });
    }
  } catch (error: any) {
    console.error('Error deleting user: ', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};