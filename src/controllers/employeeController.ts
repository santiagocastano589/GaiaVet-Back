import { Response, Request } from "express";

import Empleado from "../models/empleadoModel";
import bcrypt from 'bcrypt';
import {CustomRequest, validateEmail} from '../middlewares/authMiddlaware'

export const createEmployee = async (req: Request, res: Response) => {

    try {
        const employee = await Empleado.create(req.body);
        res.status(201).json(employee)
    } catch (error) {
        res.status(500).json({ message: 'Error to create employee', error });
    }

}

// export const updateEmployeed = async (req: Request, res: Response) => {
//     try {
//       const { cedulaEmpleado } = req.params;
//       const employee = await Empleado.findByPk(cedulaEmpleado);
//       if (employee) {
//         await employee.update(req.body);
//         res.status(200).json(employee);
//       } else {
//         res.status(404).json({ message: 'Employee not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ message: 'Error al actualizar el empleado', error });
//     }
//   };

  export const updateEmployeed = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
      const { correo } = req.user; 
      const { cedulaEmpleado, nombre, apellido, contraseña, edad, tiempoExp, estado } = req.body;
  
      const employee = await Empleado.findOne({ where: { correo } });
  
      if (!employee) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
  
      if (correo && !validateEmail(correo)) {
        return res.status(400).json({ message: 'Correo electrónico inválido' });
      }
  
      if (cedulaEmpleado) employee.cedulaEmpleado = cedulaEmpleado;
      if (nombre) employee.nombre = nombre;
      if (apellido) employee.apellido = apellido;
      if (correo) employee.correo = correo;
      if (contraseña) {
        if (contraseña.length < 6) { 
          return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }
        const salt = await bcrypt.genSalt(10);
        employee.contraseña = await bcrypt.hash(contraseña, salt);
      }
      if (edad) employee.edad = edad;
      if (tiempoExp) employee.tiempoExp = tiempoExp;
      if (typeof estado === 'boolean') employee.estado = estado;
  
      await employee.save();
  
      return res.status(200).json({ message: 'Empleado actualizado correctamente', employee });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return res.status(500).json({ message: 'Error al actualizar empleado' });
    }
  };
  
  


export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const employee = await Empleado.findAll()
        res.status(200).json(employee)

    } catch (error) {
        res.status(500).json({ message: 'Error to get employees', error });
    }

}

export const getEmployeesById = async (req:Request, res:Response) => {
    
    try {
        const { cedulaEmpleado } = req.params;
        const employee = await Empleado.findByPk(cedulaEmpleado)
        if (Empleado) {
            res.status(200).json(employee) 
        }
    } catch (error) {
        res.status(500).json({mesagge:'Error to get employee'})

    }

}

export const deleteEmployee = async (req:Request , res:Response) => {

    try{
    const {cedulaEmpleado} = req.params
    const employee = await Empleado.findByPk(cedulaEmpleado)
    if (employee) {
        await employee.destroy()
        res.status(200).json({mesagge:'Employee eliminated'})
    }else{
        res.status(404).json({message:'employee not found'})
    }
    }catch(error){
        res.status(500).json({message:'error to eliminated employee', error})
    }

   
    
    
}