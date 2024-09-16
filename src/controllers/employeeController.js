"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.getEmployeesById = exports.getEmployeesServices = exports.getAllEmployees = exports.updateEmployeed = exports.createEmployee = void 0;
const empleadoModel_1 = __importDefault(require("../models/empleadoModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authMiddlaware_1 = require("../middlewares/authMiddlaware");
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield empleadoModel_1.default.create(req.body);
        res.status(201).json(employee);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear empleado', error });
    }
});
exports.createEmployee = createEmployee;
const updateEmployeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cedulaEmpleado } = req.params;
        const { nombre, apellido, correo, contraseña, edad, tiempoExp, estado, foto } = req.body;
        const employee = yield empleadoModel_1.default.findOne({ where: { cedulaEmpleado } });
        if (!employee) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
        if (correo && !(0, authMiddlaware_1.validateEmail)(correo)) {
            return res.status(400).json({ message: 'Correo electrónico inválido' });
        }
        if (nombre)
            employee.nombre = nombre;
        if (apellido)
            employee.apellido = apellido;
        if (correo)
            employee.correo = correo;
        if (contraseña) {
            if (contraseña.length < 6) {
                return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
            }
            const salt = yield bcrypt_1.default.genSalt(10);
            employee.contraseña = yield bcrypt_1.default.hash(contraseña, salt);
        }
        if (edad)
            employee.edad = edad;
        if (tiempoExp)
            employee.tiempoExp = tiempoExp;
        if (foto)
            employee.foto = foto;
        if (typeof estado === 'boolean')
            employee.estado = estado;
        yield employee.save();
        return res.status(200).json({ message: 'Empleado actualizado correctamente', employee });
    }
    catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({ message: 'Error al actualizar empleado' });
    }
});
exports.updateEmployeed = updateEmployeed;
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield empleadoModel_1.default.findAll();
        res.status(200).json(employee);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al traer los empleados', error });
    }
});
exports.getAllEmployees = getAllEmployees;
const getEmployeesServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cargo = req.params;
    try {
        const employees = yield empleadoModel_1.default.findAll({ where: cargo });
        res.status(200).json(employees);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al traer los empleados', error });
    }
});
exports.getEmployeesServices = getEmployeesServices;
const getEmployeesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cedulaEmpleado } = req.params;
        const employee = yield empleadoModel_1.default.findByPk(cedulaEmpleado);
        if (empleadoModel_1.default) {
            res.status(200).json(employee);
        }
    }
    catch (error) {
        res.status(500).json({ mesagge: 'Error al obtener el Empleado' });
    }
});
exports.getEmployeesById = getEmployeesById;
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cedulaEmpleado } = req.params;
        const employee = yield empleadoModel_1.default.findByPk(cedulaEmpleado);
        if (employee) {
            yield employee.destroy();
            res.status(200).json({ mesagge: 'Empleado eliminado con exito' });
        }
        else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar empleado', error });
    }
});
exports.deleteEmployee = deleteEmployee;
