import Cita from "../models/citaModel";



export const authenticateEmpleado = async ():Promise<void>=> {
    const citas = await Cita.findAll();
    
  
    return;
  };