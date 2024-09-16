"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Producto extends sequelize_1.Model {
    static initModel() {
        Producto.init({
            idProducto: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
            },
            imagen: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: true,
            },
            nombreProducto: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
            },
            categoria: {
                type: sequelize_1.DataTypes.STRING(30),
                allowNull: false,
            },
            descripcion: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            stock: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            precio: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
        }, {
            sequelize: connection_1.default,
            tableName: 'producto',
            timestamps: false,
        });
    }
}
exports.default = Producto;
