"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Mascota extends sequelize_1.Model {
    static initModel() {
        this.init({
            idMascota: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: false,
            },
            edad: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            raza: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: false,
            },
            TipoMascota: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: false,
            },
            peso: {
                type: sequelize_1.DataTypes.DOUBLE(5, 2),
                allowNull: false,
            },
            Estado: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: true,
            },
            temperamento: {
                type: sequelize_1.DataTypes.STRING(30),
                allowNull: false,
            },
            foto: {
                type: sequelize_1.DataTypes.BLOB('medium'),
                allowNull: true,
            },
            fk_cedulaU: {
                type: sequelize_1.DataTypes.STRING(15),
                allowNull: false,
                references: {
                    model: 'usuario',
                    key: 'cedula',
                },
            },
        }, {
            sequelize: connection_1.default,
            tableName: 'mascota',
            timestamps: false,
        });
    }
}
exports.default = Mascota;
