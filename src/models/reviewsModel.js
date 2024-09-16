"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Reseña extends sequelize_1.Model {
    static initModel() {
        this.init({
            idReseña: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            cedulaR: {
                type: sequelize_1.DataTypes.STRING(15),
                allowNull: false,
            },
            puntuacion: {
                type: sequelize_1.DataTypes.DOUBLE(2, 1),
                allowNull: false,
            },
            comentario: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            categoria: {
                type: sequelize_1.DataTypes.STRING(30),
                allowNull: false,
            },
            fk_idCita: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'cita',
                    key: 'idCita',
                },
            },
        }, {
            sequelize: connection_1.default,
            tableName: 'reseña',
            timestamps: false,
        });
    }
}
exports.default = Reseña;
