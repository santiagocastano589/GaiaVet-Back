import { Router } from 'express';
import { createEmployee,deleteEmployee, updateEmployeed ,getAllEmployees,getEmployeesById, getEmployeesServices } from '../controllers/employeeController';
import { authenticate,accessRole } from '../middlewares/authMiddlaware';

const router = Router();

router.post('/newEmployee',authenticate,accessRole('administrador'), createEmployee);
router.get('/employees',authenticate,accessRole('administrador'), getAllEmployees);
router.get('/employee/:cedulaEmpleado',authenticate,accessRole('administrador'), getEmployeesById);
router.put('/updateEmployee/:cedulaEmpleado',authenticate,accessRole('administrador'),updateEmployeed);
router.delete('/deleteEmployee/:cedulaEmpleado',authenticate,accessRole('administrador'), deleteEmployee);
router.get('/employeServices/:cargo',authenticate,accessRole(['User','administrador']),getEmployeesServices);

export default router;