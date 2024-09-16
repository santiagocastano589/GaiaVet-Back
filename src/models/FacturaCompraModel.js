"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class fCompra extends sequelize_1.Model {
    static initModel() {
        this.init({
            idFacturaC: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true, // Auto-incrementable
            },
            fecha: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            subtotal: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            total: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            fk_cedula: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: false,
                references: {
                    model: 'usuario',
                    key: 'cedula'
                },
            }
        }, {
            sequelize: connection_1.default,
            tableName: 'facturaCompra', // Nombre de la tabla
            timestamps: false,
        });
    }
}
exports.default = fCompra;
