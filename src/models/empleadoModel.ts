import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface EmpleadoAttributes {
  cedulaEmpleado: string;
  nombre: string;
  apellido: string;
  edad: number;
  tiempoExp: string;
  correo: string;
  contrasena: string;
  fk_idServicioE: number;
}

class Empleado extends Model<EmpleadoAttributes> implements EmpleadoAttributes {
  public cedulaEmpleado!: string;
  public nombre!: string;
  public apellido!: string;
  public edad!: number;
  public tiempoExp!: string;
  public correo!: string;
  public contrasena!: string;
  public fk_idServicioE!: number;

  static initModel(): void {
    this.init(
      {
        cedulaEmpleado: {
          type: DataTypes.STRING(15),
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        apellido: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        edad: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        tiempoExp: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        correo: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        contrasena: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        fk_idServicioE: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'servicio', // Nombre de la tabla de referencia
            key: 'idServicio',
          },
        },
      },
      {
        sequelize,
        tableName: 'empleado', // Nombre de la tabla en MySQL
        timestamps: false, // Deshabilitar campos createdAt y updatedAt
        underscored: true, // Utilizar nombres de columna en snake_case
      }
    );
  }
}

export default Empleado;
