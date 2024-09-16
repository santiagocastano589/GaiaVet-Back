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
exports.sendEmail = sendEmail;
const Handlebars = require('handlebars');
const { EmailClient } = require("@azure/communication-email");
const fs = require('fs');
const path = require('path');
const connectionString = "endpoint=https://emails-gaiavet.unitedstates.communication.azure.com/;accesskey=Asnp9ZJkJDSIn1xm33OKVUMlXPJwvtXftiz0jrXSpJ4BL1pFwcyCJQQJ99AHACULyCps5mg0AAAAAZCSbniY";
const client = new EmailClient(connectionString);
function isEmailRequest(data) {
    return (typeof data.subject === 'string' &&
        typeof data.template === 'string' &&
        typeof data.dataTemplate === 'object' &&
        typeof data.dataTemplate.name === 'string' &&
        typeof data.to === 'string');
}
function sendEmail(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestData = yield request.json();
            if (!isEmailRequest(requestData)) {
                return {
                    status: 400,
                    body: 'Invalid request data'
                };
            }
            const { subject, template, dataTemplate, to } = requestData;
            const templatePath = path.join(__dirname, '../emailTemplates', template);
            if (!fs.existsSync(templatePath)) {
                return {
                    status: 404,
                    body: 'Template no encontrada'
                };
            }
            const source = fs.readFileSync(templatePath, 'utf-8');
            const compiledTemplate = Handlebars.compile(source);
            const html = compiledTemplate({ name: dataTemplate.name });
            const emailMessage = {
                senderAddress: "DoNotReply@9c75678d-f78e-4dca-9896-f31f7e1772fc.azurecomm.net",
                content: {
                    subject: subject,
                    html: html,
                },
                recipients: {
                    to: [{ address: to }],
                },
            };
            const poller = yield client.beginSend(emailMessage);
            const result = yield poller.pollUntilDone();
            return {
                status: 200,
                body: `Email enviado correctamente: ${result.messageId}`
            };
        }
        catch (error) {
            console.error('Error al enviar email:', error);
            return {
                status: 500,
                body: 'Error sending email.'
            };
        }
    });
}
