"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class Empleado extends sequelize_1.Model {
    static initModel() {
        this.init({
            cedulaEmpleado: {
                type: sequelize_1.DataTypes.STRING(15),
                primaryKey: true,
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(30),
                allowNull: false,
            },
            apellido: {
                type: sequelize_1.DataTypes.STRING(30),
                allowNull: false,
            },
            edad: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            tiempoExp: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
            },
            correo: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
            },
            contraseña: {
                type: sequelize_1.DataTypes.STRING(60),
                allowNull: false,
            },
            role: {
                type: sequelize_1.DataTypes.STRING(20),
                defaultValue: 'Empleado'
            },
            cargo: {
                type: sequelize_1.DataTypes.STRING(30),
            },
            foto: {
                type: sequelize_1.DataTypes.STRING(500)
            },
            estado: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: true
            }
        }, {
            sequelize: connection_1.default,
            tableName: 'empleado', // Nombre de la tabla en MySQL
            timestamps: false, // Deshabilitar campos createdAt y updatedAt
            hooks: {
                beforeCreate: (user) => __awaiter(this, void 0, void 0, function* () {
                    const salt = yield bcrypt_1.default.genSalt(10);
                    user.contraseña = yield bcrypt_1.default.hash(user.contraseña, salt);
                }),
            },
        });
    }
}
exports.default = Empleado;
