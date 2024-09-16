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
exports.validateStatus = exports.loginUser = exports.authenticateUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const empleadoModel_1 = __importDefault(require("../models/empleadoModel"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
dotenv_1.default.config();
const JWT_SECRET = "clavemamalona";
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const authenticateUser = (correo, contraseña) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ where: { correo } });
    if (user) {
        if (yield bcrypt_1.default.compare(contraseña, user.contraseña)) {
            return user;
        }
        else {
            return "Contraseña Incorrecta";
        }
    }
    return null;
});
exports.authenticateUser = authenticateUser;
const authenticateEmpleado = (correo, contraseña) => __awaiter(void 0, void 0, void 0, function* () {
    const empleado = yield empleadoModel_1.default.findOne({ where: { correo } });
    if (empleado) {
        if (yield bcrypt_1.default.compare(contraseña, empleado.contraseña)) {
            return empleado;
        }
        else {
            return "Contraseña Incorrecta";
        }
    }
    return null;
});
const authenticateAdministrador = (correo, contraseña) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield adminModel_1.default.findOne({ where: { correo } });
    if (admin) {
        if (yield bcrypt_1.default.compare(contraseña, admin.contraseña)) {
            return admin;
        }
        else {
            return "Contraseña Incorrecta";
        }
    }
    return null;
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { correo, contraseña } = req.body;
        if (!correo || !contraseña) {
            return res.status(400).json({ message: 'Correo o contraseña vacíos' });
        }
        if (!validateEmail(correo)) {
            return res.status(400).json({ message: 'Correo electrónico inválido' });
        }
        let user = yield (0, exports.authenticateUser)(correo, contraseña);
        let userType = 'user';
        if (user === "Contraseña Incorrecta") {
            return res.status(401).json({ message: 'Contraseña incorrecta para usuario' });
        }
        if (!user) {
            user = yield authenticateEmpleado(correo, contraseña);
            userType = 'empleado';
            if (user === "Contraseña Incorrecta") {
                return res.status(401).json({ message: 'Contraseña incorrecta para empleado' });
            }
        }
        if (!user) {
            user = yield authenticateAdministrador(correo, contraseña);
            userType = 'administrador';
            if (user === "Contraseña Incorrecta") {
                return res.status(401).json({ message: 'Contraseña incorrecta para administrador' });
            }
        }
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Validar el estado del usuario
        const isActive = yield (0, exports.validateStatus)(correo, userType);
        if (!isActive) {
            return res.status(403).json({ message: 'Cuenta desactivada' });
        }
        // Generar el token JWT
        const token = jsonwebtoken_1.default.sign({ correo: user.correo, role: user.role, userType }, JWT_SECRET, { expiresIn: '1h' });
        res.setHeader('Authorization', `Bearer ${token}`);
        return res.status(200).json({ nombre: user.nombre, token });
    }
    catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});
exports.loginUser = loginUser;
const validateStatus = (correo, rol) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    switch (rol) {
        case 'user':
            user = yield userModel_1.default.findOne({ where: { correo } });
            console.log(correo);
            break;
        case 'administrador':
            user = yield adminModel_1.default.findOne({ where: { correo } });
            break;
        case 'empleado':
            user = yield empleadoModel_1.default.findOne({ where: { correo } });
            break;
        default:
            return false;
    }
    if (user) {
        return user.estado;
    }
    return false;
});
exports.validateStatus = validateStatus;
