import { Router } from 'express';
import { createEmployee,deleteEmployee, updateEmployeed ,getAllEmployees,getEmployeesById } from '../controllers/employeeController';
import { authenticate,accessRole } from '../middlewares/authMiddlaware';

const router = Router();

router.post('/empleado',authenticate,accessRole('administrador'), createEmployee);
router.get('/employees',authenticate,accessRole('administrador'), getAllEmployees);
router.get('/empleado/:cedulaEmpleado',authenticate,accessRole('administrador'), getEmployeesById);
router.put('/empleados/:cedulaEmpleado',authenticate,accessRole('administrador'),updateEmployeed);
router.delete('/empleados/:cedulaEmpleado',authenticate,accessRole('administrador'), deleteEmployee);

export default router;