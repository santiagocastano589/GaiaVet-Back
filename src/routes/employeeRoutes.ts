import { Router } from 'express';
import { createEmployee,deleteEmployee, updateEmployeed ,getAllEmployees,getEmployeesById } from '../controllers/employeeController';

const router = Router();

router.post('/empleados', createEmployee);
router.get('/empleados', getAllEmployees);
router.get('/empleado/:cedulaEmpleado', getEmployeesById);
router.put('/empleados/:cedulaEmpleado',updateEmployeed);
router.delete('/empleados/:cedulaEmpleado', deleteEmployee);

export default router;