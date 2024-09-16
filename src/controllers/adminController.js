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
exports.createAdmin = void 0;
const adminModel_1 = __importDefault(require("../models/adminModel"));
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nit, nombre, correo, contraseña, direccion, telefono, role, estado } = req.body;
        // const exist = await Admin.findOne({ where: { [Op.or]: [ { correo }, { cedula } ] } });
        // if (!exist) {
        //   res.status(201).json(newUser);
        // } else {
        //   res.status(400).json({ message: "Estos datos ya están asociados a otra cuenta" });
        // }
        const newUser = yield adminModel_1.default.create({ nit, nombre, correo, contraseña, direccion, telefono, role, estado });
        res.status(200).json(newUser);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error al crear el Usuario" });
    }
});
exports.createAdmin = createAdmin;
