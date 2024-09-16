"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Cita extends sequelize_1.Model {
    static initModel() {
        this.init({
            idCita: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            tipoCita: {
                type: sequelize_1.DataTypes.STRING(30),
                allowNull: false,
            },
            fecha: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            hora: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            tipoMascota: {
                type: sequelize_1.DataTypes.STRING(30),
                allowNull: false,
            },
            estadoCita: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: false,
                values: ['Pendiente', 'Cancelada', 'Confirmada', 'Terminada'],
                defaultValue: "Pendiente"
            },
            fk_id_mascota: {
                type: sequelize_1.DataTypes.NUMBER,
                allowNull: false,
                references: {
                    model: 'mascota',
                    key: 'idMascota'
                },
            },
            fk_nit: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'veterinaria',
                    key: 'nit'
                },
            },
            fk_cc_Empleado: {
                type: sequelize_1.DataTypes.STRING(12),
                allowNull: false,
                references: {
                    model: 'empleado',
                    key: 'cedulaEmpleado'
                },
            }
        }, {
            sequelize: connection_1.default,
            tableName: 'cita',
            timestamps: false,
        });
    }
}
exports.default = Cita;
