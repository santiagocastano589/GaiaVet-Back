import { Response, Request } from "express";

import Empleado from "../models/empleadoModel";
import bcrypt from 'bcrypt';
import {CustomRequest, validateEmail} from '../middlewares/authMiddlaware'

export const createEmployee = async (req: Request, res: Response) => {

    try {
        const employee = await Empleado.create(req.body);
        res.status(201).json(employee)
    } catch (error) {
        res.status(500).json({ message: 'Error al crear empleado', error });
    }

}


  export const updateEmployeed = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
      const { cedulaEmpleado } = req.params; 
      const { nombre, apellido, correo, contraseña, edad, tiempoExp, estado,foto } = req.body;
  
      const employee = await Empleado.findOne({ where: { cedulaEmpleado } });
  
      if (!employee) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
  
      if (correo && !validateEmail(correo)) {
        return res.status(400).json({ message: 'Correo electrónico inválido' });
      }
  
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
      if (foto) employee.foto=foto      
      
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
        res.status(500).json({ message: 'Error al traer los empleados', error });
    }

}

export const getEmployeesServices = async (req: Request, res: Response) => {
  const cargo = req.params
  try {

      const employees = await Empleado.findAll({where:cargo})
      res.status(200).json(employees)
  } catch (error) {
      res.status(500).json({ message: 'Error al traer los empleados', error });
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
        res.status(500).json({mesagge:'Error al obtener el Empleado'})

    }

}


export const deleteEmployee = async (req:Request , res:Response) => {

    try{
    const {cedulaEmpleado} = req.params
    const employee = await Empleado.findByPk(cedulaEmpleado)
    if (employee) {
        await employee.destroy()
        res.status(200).json({mesagge:'Empleado eliminado con exito'})
    }else{
        res.status(404).json({message:'Empleado no encontrado'})
    }
    }catch(error){
        res.status(500).json({message:'Error al eliminar empleado', error})
    }
}

