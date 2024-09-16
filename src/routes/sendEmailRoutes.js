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
const express_1 = require("express");
const emailController_1 = require("../controllers/emailController");
const router = (0, express_1.Router)();
router.post('/send-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const request = {
            body: req.body,
            headers: req.headers,
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
            bodyUsed: false,
            arrayBuffer: () => __awaiter(void 0, void 0, void 0, function* () { return Buffer.from([]); }),
            json: () => __awaiter(void 0, void 0, void 0, function* () { return req.body; }),
        };
        const context = {};
        const response = yield (0, emailController_1.sendEmail)(request, context);
        res.status((_a = response.status) !== null && _a !== void 0 ? _a : 500).send((_b = response.body) !== null && _b !== void 0 ? _b : 'Error handling send email request.');
    }
    catch (error) {
        console.error('Error handling send email request: ', error);
        res.status(500).send('Error handling send email request.');
    }
}));
exports.default = router;
