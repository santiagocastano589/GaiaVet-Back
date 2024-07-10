import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: 'gaiaVet',
  username: 'root',
  password: 'Sena1234',
  host: 'localhost', 
  dialect: 'mysql',
});

export default sequelize;
