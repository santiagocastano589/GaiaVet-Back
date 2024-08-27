import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes'; // Importa las rutas de autenticación
import dotenv from 'dotenv';
import User from './models/userModel';
import { authenticate } from './middlewares/authMiddlaware';
import sequelize from './db/connection';
import cors, { CorsOptions } from 'cors';
import Empleado from './models/empleadoModel';
import adminRoutes from './routes/adminRoutes'
import employeeRoutes from "./routes/employeeRoutes";
import appointmentRoutes from "./routes/appointmentRoutes"
import Cita from './models/citaModel';
import Producto from './models/productoModel';
import productRoutes from "./routes/productRoutes";
import  sendEmailRoutes from './routes/sendEmailRoutes';




User.initModel();
Empleado.initModel();
Cita.initModel();
Producto.initModel()



dotenv.config();


const app: Application = express();
const port: string | number = process.env.PORT || 3500;

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
app.use('/',employeeRoutes)
app.use('/',appointmentRoutes)
app.use('/',productRoutes)
app.use('/',sendEmailRoutes)


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
