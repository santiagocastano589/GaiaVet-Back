"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    database: 'GaiaVet',
    username: 'admin',
    password: 'Gaiavet12345',
    host: 'prueba.creic8ccuped.us-east-2.rds.amazonaws.com',
    dialect: 'mysql',
});
exports.default = sequelize;
