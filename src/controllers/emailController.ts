import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
const Handlebars = require('handlebars');
const { EmailClient } = require("@azure/communication-email");
const fs = require('fs');
const path = require('path');


const connectionString = "endpoint=https://emails-gaiavet.unitedstates.communication.azure.com/;accesskey=Asnp9ZJkJDSIn1xm33OKVUMlXPJwvtXftiz0jrXSpJ4BL1pFwcyCJQQJ99AHACULyCps5mg0AAAAAZCSbniY";
const client = new EmailClient(connectionString);


interface EmailRequest {
    subject: string;
    template: string;
    dataTemplate: { name: string };
    to: string;
}


function isEmailRequest(data: any): data is EmailRequest {
    return (
        typeof data.subject === 'string' &&
        typeof data.template === 'string' &&
        typeof data.dataTemplate === 'object' &&
        typeof data.dataTemplate.name === 'string' &&
        typeof data.to === 'string'
    );
}


export async function sendEmail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        
        const requestData = await request.json();

        
        if (!isEmailRequest(requestData)) {
            return {
                status: 400,
                body: 'Invalid request data'
            };
        }

        const { subject, template, dataTemplate, to } = requestData;

        const templatePath = path.join(__dirname,'../emailTemplates', template);
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

        const poller = await client.beginSend(emailMessage);
        const result = await poller.pollUntilDone();

        return {
            status: 200,
            body: `Email enviado correctamente: ${result.messageId}`
        };
    } catch (error) {
        console.error('Error al enviar email:', error);
        return {
            status: 500,
            body: 'Error sending email.'
        };
    }
}