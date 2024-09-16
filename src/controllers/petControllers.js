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
exports.petsUser = exports.deletePet = exports.updatePet = exports.findPetsUser = exports.createPet = exports.getAllPet = exports.gmail = void 0;
const petModel_1 = __importDefault(require("../models/petModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const gmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const correo = req['user']['correo'];
    const user = yield userModel_1.default.findOne({ where: { correo: correo } });
    console.log(user);
});
exports.gmail = gmail;
const getAllPet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Pets = yield petModel_1.default.findAll({ where: { Estado: true } });
        res.status(200).json(Pets);
    }
    catch (error) {
        console.error('Error Al Buscar Las Mascotas: ', error);
        res.status(500).json({ message: 'No se pudo encontrar las mascotas' });
    }
});
exports.getAllPet = getAllPet;
const createPet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const correo = req['user']['correo'];
    const user = yield userModel_1.default.findOne({ where: { correo: correo } });
    if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
    }
    const cedula = user.cedula;
    try {
        const { nombre, edad, raza, peso, temperamento, foto, Estado, TipoMascota } = req.body;
        if (!nombre || !edad || !raza || !peso || !temperamento || !foto) {
            res.status(400).json({ message: 'Error Campos vacios' });
            return;
        }
        const fk_cedulaU = cedula + "";
        const newPet = yield petModel_1.default.create({ nombre, edad, raza, TipoMascota, peso, temperamento, foto, fk_cedulaU, Estado });
        res.status(201).json(newPet);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear la mascota' });
    }
});
exports.createPet = createPet;
const findPetsUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const correo = req['user']['correo'];
    try {
        const user = yield userModel_1.default.findOne({ where: { correo: correo } });
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        const fk_cedulaU = user.cedula.toString();
        const pets = yield petModel_1.default.findAll({ where: { fk_cedulaU: fk_cedulaU, Estado: true } });
        if (pets.length > 0) {
            res.status(200).json(pets);
        }
        else {
            res.status(404).json({ message: 'Mascota no encontrada' });
        }
    }
    catch (error) {
        console.error('Error fetching pet: ', error);
        res.status(500).json({ message: 'Error al encontrar la mascota.' });
    }
});
exports.findPetsUser = findPetsUser;
const updatePet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idMascota } = req.params;
    const { nombre, edad, raza, peso, temperamento, foto, TipoMascota } = req.body;
    if (!nombre || !edad || !raza || !peso || !temperamento || !foto) {
        res.status(400).json({ message: 'Error Campos vacios' });
        return;
    }
    try {
        const pet = yield petModel_1.default.findByPk(idMascota);
        if (pet) {
            yield pet.update({
                nombre,
                edad,
                raza,
                TipoMascota,
                peso,
                temperamento,
                foto
            });
            const updatedPet = yield petModel_1.default.findByPk(idMascota);
            res.status(200).json(updatedPet);
        }
        else {
            res.status(404).json({ message: 'Mascota no encontrada' });
        }
    }
    catch (error) {
        console.error('Error updating mascota: ', error);
        res.status(500).json({ message: 'Error al actualizar' });
    }
});
exports.updatePet = updatePet;
const deletePet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idMascota } = req.params;
    try {
        const user = yield petModel_1.default.findByPk(idMascota);
        if (user) {
            yield petModel_1.default.update({ Estado: false }, { where: { idMascota } });
            res.status(200).json({ message: 'Macota eliminado exitosamente' });
        }
        else {
            res.status(404).json({ message: 'Macota no encontrado' });
        }
    }
    catch (error) {
        console.error('Error deleting user: ', error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});
exports.deletePet = deletePet;
const petsUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cedula = req.body;
        const fk_cedulaU = cedula;
        const pet = yield petModel_1.default.findAll({ where: fk_cedulaU });
        if (pet) {
            res.status(200).json(pet);
        }
        else {
            res.status(404).json({ message: 'Mascota no encontrada' });
        }
    }
    catch (error) {
        console.error('Error fetching pet: ', error);
        res.status(500).json({ message: 'Error al encontrar la mascota.' });
    }
});
exports.petsUser = petsUser;
