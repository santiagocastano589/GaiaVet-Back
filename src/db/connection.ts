import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: 'GaiaVet',
  username: 'admin',
  password: 'Gaiavet12345',
  host: 'prueba.creic8ccuped.us-east-2.rds.amazonaws.com', 
  dialect: 'mysql',
});

export default sequelize;
