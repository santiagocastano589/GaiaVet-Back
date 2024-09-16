"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class DetalleFactura extends sequelize_1.Model {
    static initModel() {
        this.init({
            idDetalle: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            fk_idFacturaC: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'facturaCompra',
                    key: 'idFacturaC'
                },
            },
            fk_idProducto: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'producto',
                    key: 'idProducto'
                },
            },
            cantidad: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            precioUnitario: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
        }, {
            sequelize: connection_1.default,
            tableName: 'detalleFactura', // Nombre de la tabla en la base de datos
            timestamps: false, // No utiliza `createdAt` ni `updatedAt`
        });
    }
}
exports.default = DetalleFactura;
