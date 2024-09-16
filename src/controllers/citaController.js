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
exports.GetAppointmentDate = exports.updateCita = exports.getUserAppointment = exports.getCitas = exports.updateCitaEstado = exports.newCita = void 0;
const citaModel_1 = __importDefault(require("../models/citaModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
const petModel_1 = __importDefault(require("../models/petModel"));
const moment_business_days_1 = __importDefault(require("moment-business-days"));
const newCita = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const correo = req['user']['correo'];
    const user = yield userModel_1.default.findOne({ where: { correo: correo } });
    if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
    }
    const { idCita, tipoCita, fecha, hora, tipoMascota, estadoCita, fk_id_mascota, fk_cc_Empleado } = req.body;
    try {
        const admin = yield adminModel_1.default.findByPk(159753);
        if (!admin) {
            res.status(404).json("Error");
            return;
        }
        const fk_nit = admin === null || admin === void 0 ? void 0 : admin.nit;
        const cita = yield citaModel_1.default.create({ idCita, tipoCita, fecha, hora, tipoMascota, estadoCita, fk_id_mascota, fk_nit, fk_cc_Empleado });
        res.status(201).json(cita);
    }
    catch (error) {
        console.error('Error al crear la cita:', error);
        res.status(500).json({ message: 'Error al crear la cita', error });
    }
});
exports.newCita = newCita;
const updateCitaEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { estadoCita } = req.body;
    try {
        const cita = yield citaModel_1.default.findByPk(id);
        if (!cita) {
            res.status(404).json({ message: 'Cita no encontrada' });
            return;
        }
        cita.estadoCita = estadoCita;
        yield cita.save();
        res.status(200).json(cita);
    }
    catch (error) {
        console.error('Error al actualizar el estado de la cita:', error);
        res.status(500).json({ message: 'Error al actualizar el estado de la cita', error });
    }
});
exports.updateCitaEstado = updateCitaEstado;
const getCitas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const citasPendientes = yield citaModel_1.default.findAll();
    if (!citasPendientes) {
        res.status(404).json('No se encontraron citas');
    }
    res.status(200).json(citasPendientes);
});
exports.getCitas = getCitas;
const getUserAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const correo = req['user']['correo'];
        if (!correo) {
            res.status(404).json({ message: 'No se encontró el usuario' + correo });
            return;
        }
        const user = yield userModel_1.default.findOne({ where: { correo: correo } });
        if (!user) {
            res.status(404).json({ message: 'No se encontró el usuario' });
            return;
        }
        const pets = yield petModel_1.default.findAll({ where: { fk_cedulaU: user.cedula } });
        if (pets.length === 0) {
            res.status(404).json({ message: 'No se encontraron mascotas para el usuario' });
            return;
        }
        const idMascotas = pets.map(mascota => mascota.idMascota);
        const Appointment = yield citaModel_1.default.findAll({ where: { fk_id_mascota: idMascotas } });
        if (Appointment.length === 0) {
            res.status(404).json({ message: 'No se encontraron citas para las mascotas del usuario' });
            return;
        }
        res.status(200).json(Appointment);
    }
    catch (error) {
        console.error('Error al obtener las citas pendientes:', error);
        res.status(500).json({ message: 'Error al obtener las citas pendientes', error });
    }
});
exports.getUserAppointment = getUserAppointment;
const updateCita = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idCita } = req.params;
    const { fechaHoraCita } = req.body;
    try {
        const cita = yield citaModel_1.default.findByPk(idCita);
        if (!cita) {
            res.status(404).json({ message: 'Cita no encontrada' });
            return;
        }
        const nuevaFecha = (0, moment_business_days_1.default)(fechaHoraCita);
        const hoy = (0, moment_business_days_1.default)();
        if (!nuevaFecha.isBusinessDay() || nuevaFecha.isSameOrBefore(hoy.businessAdd(2))) {
            res.status(400).json({
                message: 'La fecha debe ser al menos 2 días hábiles después de la fecha actual.',
            });
            return;
        }
        cita.fecha = nuevaFecha.toDate();
        yield cita.save();
        res.status(200).json({ message: 'Fecha de la cita actualizada correctamente', cita });
    }
    catch (error) {
        console.error('Error al actualizar la cita:', error);
        res.status(500).json({ message: 'Error al actualizar la cita', error });
    }
});
exports.updateCita = updateCita;
const GetAppointmentDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtén la fecha desde los parámetros de la solicitud
        const { fecha } = req.params;
        // Convierte la fecha proporcionada en un objeto Date
        const fechaConsulta = new Date(fecha);
        // Verifica si la fecha es válida
        if (isNaN(fechaConsulta.getTime())) {
            res.status(400).json({ error: 'Fecha inválida.' });
            return;
        }
        // Obtén todas las citas
        const citas = yield citaModel_1.default.findAll();
        const fechaConsultaStr = fechaConsulta.toISOString().split('T')[0]; // convierte a YYYY-MM-DD
        const citasFiltradas = citas.filter(cita => {
            const fechaCitaStr = new Date(cita.fecha).toISOString().split('T')[0];
            return fechaCitaStr === fechaConsultaStr && cita.estadoCita === 'Pendiente'; // return boolean
        });
        // Devuelve las citas filtradas con la hora
        res.status(200).json(citasFiltradas);
    }
    catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({ error: 'Error al obtener citas' });
    }
});
exports.GetAppointmentDate = GetAppointmentDate;
