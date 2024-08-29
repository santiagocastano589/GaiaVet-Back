import { Router, Request, Response } from 'express';
import { sendEmail } from '../controllers/emailController'; 

const router = Router();


router.post('/send-email', async (req: Request, res: Response) => {
    try {
       
        const request = {
            body: req.body,
            headers: req.headers,
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
            
            bodyUsed: false,
            arrayBuffer: async () => Buffer.from([]),
            json: async () => req.body,
        };

        const context = {}; 

        
        const response = await sendEmail(request as any, context as any);

        
        res.status(response.status ?? 500).send(response.body ?? 'Error handling send email request.');
    } catch (error) {
        console.error('Error handling send email request: ', error);
        res.status(500).send('Error handling send email request.');
    }
});

export default router;