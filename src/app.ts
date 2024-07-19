import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes'; // Importa las rutas de autenticación
import dotenv from 'dotenv';
import User from './models/userModel';
import { authenticate } from './middlewares/authMiddlaware';
import sequelize from './db/connection';
import cors, { CorsOptions } from 'cors';
User.initModel();


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

//app.use(authenticate)

app.use('/', userRoutes);
app.use('/auth', authRoutes); // Usa las rutas de autenticación

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
