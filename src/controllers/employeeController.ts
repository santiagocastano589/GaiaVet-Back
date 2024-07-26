import { Response, Request } from "express";

import Empleado from "../models/empleadoModel";

export const createEmployee = async (req: Request, res: Response) => {

    try {
        const employee = await Empleado.create(req.body);
        res.status(201).json(employee)
    } catch (error) {
        res.status(500).json({ message: 'Error to create employee', error });
    }

}

export const updateEmpleado = async (req: Request, res: Response) => {
    try {
      const { cedulaEmpleado } = req.params;
      const employee = await Empleado.findByPk(cedulaEmpleado);
      if (employee) {
        await employee.update(req.body);
        res.status(200).json(employee);
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el empleado', error });
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