import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes'; // Importa las rutas de autenticación
import dotenv from 'dotenv';
import User from './models/userModel';
import sequelize from './db/connection';

User.initModel();

dotenv.config();

const app: Application = express();
const port: string | number = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', userRoutes);
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
