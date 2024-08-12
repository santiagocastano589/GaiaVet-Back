import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import User from './models/userModel';
import sequelize from './db/connection';
import cors from 'cors';
import Empleado from './models/empleadoModel';
import adminRoutes from './routes/adminRoutes';
import Admin from './models/adminModel';
import authRoutes from './routes/authRoutes';
import petRoutes from './routes/petRoutes';
import Mascota from './models/petModel';
import employeeRoutes from './routes/employeeRoutes';
import productoRoutes from './routes/productoRoutes';
import Producto from './models/productoModel';
import { payment } from '../src/config/mercadoPagoConfig';  // Importa la configuración de Mercado Pago

dotenv.config();

const app: Application = express();
const port: string | number = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
User.initModel();
Empleado.initModel();
Admin.initModel();
Mascota.initModel();
Producto.initModel();

app.use('/', userRoutes);
app.use('/auth', authRoutes);
app.use('/', adminRoutes);
app.use('/', petRoutes);
app.use('/', employeeRoutes);
app.use('/', productoRoutes);


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
  async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log('Conexión establecida correctamente.');
    } catch (error) {
      console.error('No se pudo conectar a la base de datos:', error);
    }
  }
  testConnection();

  console.log(`Server running on port ${port}`);
});