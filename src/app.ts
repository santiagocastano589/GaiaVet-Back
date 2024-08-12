import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { payment } from '../src/config/mercadoPagoConfig';  // Importa la configuración de Mercado Pago

dotenv.config();

const app: Application = express();
const port: string | number = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/api/create_payment', async (req: Request, res: Response) => {
  try {
    const body = {
      transaction_amount: req.body.transaction_amount,
      description: req.body.description,
      payment_method_id: req.body.payment_method_id,
      payer: {
        email: req.body.payer_email
      },
    };

    // Opcional: Configura opciones de solicitud
    const requestOptions = {
      idempotencyKey: req.body.idempotency_key || undefined,
    };

    // Crea el pago
    const response = await payment.create({ body, requestOptions });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
