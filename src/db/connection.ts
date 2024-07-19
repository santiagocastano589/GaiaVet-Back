import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: 'GaiaVetBD',
  username: 'root',
  password: '1111',
  host: 'localhost', 
  dialect: 'mysql',
});

export default sequelize;
