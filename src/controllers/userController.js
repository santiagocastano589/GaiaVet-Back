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
exports.deleteAccount = exports.updateUser = exports.me = exports.findOneUser = exports.createUser = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const authMiddlaware_1 = require("../middlewares/authMiddlaware");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const emailController_1 = require("./emailController");
const JWT_SECRET = "clavemamalona";
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users: ', error);
        res.status(500).json({ message: 'Error fetching users.' });
    }
});
exports.getAllUsers = getAllUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cedula, nombre, apellido, correo, contraseña, direccion, telefono, estado, role, imagen } = req.body;
        const exist = yield userModel_1.default.findOne({ where: { [sequelize_1.Op.or]: [{ correo }, { cedula }] } });
        if (!exist) {
            const newUser = yield userModel_1.default.create({ cedula, nombre, apellido, correo, contraseña, direccion, telefono, estado, role, imagen });
            const emailRequest = {
                subject: 'Bienvenido a Gaiavet🐾',
                template: 'correo.html',
                dataTemplate: { name: nombre },
                to: correo,
            };
            const request = {
                json: () => __awaiter(void 0, void 0, void 0, function* () { return emailRequest; }),
            };
            const context = {};
            const response = yield (0, emailController_1.sendEmail)(request, context);
            console.log(`Email enviado: ${response.body}`);
            res.status(201).json(newUser);
        }
        else {
            res.status(400).json({ message: "Estos datos ya están asociados a otra cuenta" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error al crear el Usuario" });
    }
});
exports.createUser = createUser;
const findOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cedula } = req.params;
        const user = yield userModel_1.default.findOne({ where: { cedula } });
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (error) {
        console.error('Error fetching user: ', error);
        res.status(500).json({ message: 'Error al encontrar el usuario.' });
    }
});
exports.findOneUser = findOneUser;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const correo = req['user']['correo'];
        let user = yield userModel_1.default.findOne({ where: { correo } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json({ nombre: user.nombre, apellido: user.apellido, correo: user.correo, direccion: user.direccion, telefono: user.telefono, imagen: user.imagen });
    }
    catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({ message: 'Error al obtener usuario' });
    }
});
exports.me = me;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { correo } = req.user;
        const { nombre, apellido, contraseña, direccion, telefono, estado, imagen } = req.body;
        const user = yield userModel_1.default.findOne({ where: { correo } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        if (correo && !(0, authMiddlaware_1.validateEmail)(correo)) {
            return res.status(400).json({ message: 'Correo electrónico inválido' });
        }
        if (nombre)
            user.nombre = nombre;
        if (apellido)
            user.apellido = apellido;
        if (correo)
            user.correo = correo;
        if (contraseña) {
            if (contraseña.length < 6) {
                return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
            }
            const salt = yield bcrypt_1.default.genSalt(10);
            user.contraseña = yield bcrypt_1.default.hash(contraseña, salt);
        }
        if (direccion)
            user.direccion = direccion;
        if (telefono)
            user.telefono = telefono;
        if (typeof estado === 'boolean')
            user.estado = estado;
        if (imagen)
            user.imagen = imagen;
        yield user.save();
        return res.status(200).json({ message: 'Usuario actualizado correctamente', user });
    }
    catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({ message: 'Error al actualizar usuario' });
    }
});
exports.updateUser = updateUser;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const correo = req['user']['correo'];
    try {
        const user = yield userModel_1.default.findOne({ where: { correo } });
        if (user) {
            yield userModel_1.default.update({ estado: false }, { where: { cedula: user.cedula } });
            return res.status(200).json({ message: 'Usuario Eliminado' });
        }
        // Si no se encuentra el usuario, envía la respuesta 404
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    catch (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});
exports.deleteAccount = deleteAccount;
