import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import User from './models/userModel';
import { authenticate } from './middlewares/authMiddlaware';
import sequelize from './db/connection';
import cors, { CorsOptions } from 'cors';
import Empleado from './models/empleadoModel';
import adminRoutes from './routes/adminRoutes'
import Admin from './models/adminModel';
import authRoutes from './routes/authRoutes'


User.initModel();
Empleado.initModel();
Admin.initModel();

dotenv.config();


const app: Application = express();
const port: string | number = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

/*const corsOptions: CorsOptions = {
  origin: 'https://example.com',  // Permitir solo este origen
  methods: ['GET', 'POST'],       // Permitir solo estos métodos HTTP
  allowedHeaders: ['Authorization'] // Permitir solo estos encabezados
};*/


app.use('/', userRoutes);
app.use('/auth', authRoutes);
app.use('/',adminRoutes)

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
