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
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactInfo = void 0;
const emailController_1 = require("./emailController");
const contactInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, telefono, correo, asunto, mensaje } = req.body;
        const emailRequest = {
            subject: asunto,
            template: 'contacto.html',
            dataTemplate: { name: nombre, telefono: telefono, correo: correo, asunto: asunto, mensaje: mensaje },
            to: "jhonedisonjurado59@gmail.com",
        };
        const request = {
            json: () => __awaiter(void 0, void 0, void 0, function* () { return emailRequest; }),
        };
        const context = {};
        const response = yield (0, emailController_1.sendEmail)(request, context);
        if (response) {
            res.status(201).json("Contacto enviado correctamente");
        }
        else {
            throw new Error("Error al enviar el correo");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al enviar correo" });
    }
});
exports.contactInfo = contactInfo;
