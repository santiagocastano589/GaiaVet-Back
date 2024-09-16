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
exports.updateReseña = exports.DeleteReviews = exports.Reviews = exports.NewReview = void 0;
const reviewsModel_1 = __importDefault(require("../models/reviewsModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const NewReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const correo = req['user']['correo'];
    const user = yield userModel_1.default.findOne({ where: { correo } });
    const cedulaR = user === null || user === void 0 ? void 0 : user.cedula;
    if (!user) {
        return res.status(404).json('Error al encontrar el usuario');
    }
    try {
        const { idReseña, puntuacion, comentario, categoria, fk_idCita } = req.body;
        const cedulaR = user.cedula.toString();
        if (!cedulaR || !puntuacion || !comentario || !categoria || !fk_idCita) {
            res.status(400).json({ message: 'Error, Campos Vacios' });
        }
        const reseña = yield reviewsModel_1.default.create({ idReseña, cedulaR, puntuacion, comentario, categoria, fk_idCita });
        return res.status(200).json(reseña);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al crear la reseña' });
    }
});
exports.NewReview = NewReview;
const Reviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoria = req.body;
    try {
        const Reseñas = yield reviewsModel_1.default.findAll({ where: categoria });
        return res.status(200).json(Reseñas);
    }
    catch (error) {
        return res.status(404).json({ message: "Error al obtener las Reseñas" });
    }
});
exports.Reviews = Reviews;
const DeleteReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const correo = req['user']['correo'];
    const user = yield userModel_1.default.findAll({ where: correo });
    if (!user) {
        return res.status(404).json({ message: "No se encontro el usuario" });
    }
    try {
        const { idReseña } = req.body;
        const reseña = yield reviewsModel_1.default.destroy({ where: idReseña });
        return res.status(200).json(reseña);
    }
    catch (error) {
        return res.status(404).json({ message: "Error al eliminar la reseña" });
    }
});
exports.DeleteReviews = DeleteReviews;
const updateReseña = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idReseña, puntuacion, comentario } = req.body;
        const reseña = yield reviewsModel_1.default.findByPk(idReseña);
        if (reseña) {
            yield reseña.update({
                puntuacion,
                comentario
            });
        }
        const reseñaUpdate = yield reviewsModel_1.default.findByPk(idReseña);
        return res.status(200).json(reseñaUpdate);
    }
    catch (error) {
        return res.status(200).json({ message: "Error al actualizar la reseña" });
    }
});
exports.updateReseña = updateReseña;
