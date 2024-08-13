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
import { MercadoPagoConfig, Preference } from 'mercadopago';
import Producto from './models/productoModel';

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


const client = new MercadoPagoConfig({ accessToken: 'APP_USR-8827196264162858-081217-755e5d2b5e722ca8f3c7042df40dbed3-1941685779' });


app.post("/create_preference", async (req,res) => {

  try {
    const body = {
      items:[
        {
          id: req.body.idProduct,
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "COP"
        },
      ],
      back_urls:{
        success: "https://www.youtube.com/watch?v=-e_3Cg9GZFU",
        failure: "https://www.youtube.com/watch?v=-e_3Cg9GZFU",
        pending: "https://www.youtube.com/watch?v=-e_3Cg9GZFU"
      },
      auto_return: "approved"
    }

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({
      id: result.id,
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al crear la preferencia"
    })
    
  }
})

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