"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Admin extends sequelize_1.Model {
    static initModel() {
        this.init({
            nit: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(30),
                allowNull: false,
            },
            correo: {
                type: sequelize_1.DataTypes.STRING(60),
                allowNull: false,
            },
            contraseña: {
                type: sequelize_1.DataTypes.STRING(60),
                allowNull: false,
            },
            direccion: {
                type: sequelize_1.DataTypes.STRING(60),
                allowNull: true,
            },
            telefono: {
                type: sequelize_1.DataTypes.STRING(12),
                allowNull: true,
            },
            estado: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: true
            },
            role: {
                type: sequelize_1.DataTypes.STRING(20),
                defaultValue: 'administrador'
            }
        }, {
            sequelize: connection_1.default,
            tableName: 'veterinaria',
            timestamps: false,
            underscored: true,
        });
    }
}
exports.default = Admin;
