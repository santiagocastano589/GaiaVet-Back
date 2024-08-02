import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface CitaAttributes {
  idCita?: number; // Opcional porque es auto-incremental
  tipoCita?: string;
  fechaHoraCita?: Date;
  tipoMascota?: string;
  estadoCita?: string;
  fk_cc_usuario?: string;
  fk_nit?: number;
  fk_cc_Empleado?: string;
}

class Cita extends Model<CitaAttributes> implements CitaAttributes {
  public idCita!: number;
  public tipoCita!: string;
  public fechaHoraCita!: Date;
  public tipoMascota!: string;
  public estadoCita!: string;
  public fk_cc_usuario!: string;
  public fk_nit!: number;
  public fk_cc_Empleado!: string;

  static initModel(): void {
    this.init(
      {
        idCita: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
          field: 'idCita' // Nombre de la columna en la base de datos
        },
        tipoCita: {
          type: DataTypes.STRING(30),
          allowNull: true, // La columna puede ser NULL
          field: 'tipoCita' // Nombre de la columna en la base de datos
        },
        fechaHoraCita: {
          type: DataTypes.DATE,
          allowNull: true, // La columna puede ser NULL
          field: 'fechaHoraCita' // Nombre de la columna en la base de datos
        },
        tipoMascota: {
          type: DataTypes.STRING(30),
          allowNull: true, // La columna puede ser NULL
          field: 'tipoMascota' // Nombre de la columna en la base de datos
        },
        estadoCita: {
          type: DataTypes.STRING(20),
          allowNull: true, // La columna puede ser NULL
          field: 'estadoCita' // Nombre de la columna en la base de datos
        },
        fk_cc_usuario: {
          type: DataTypes.STRING(15),
          allowNull: true, // La columna puede ser NULL
          field: 'fk_cc_usuario' // Nombre de la columna en la base de datos
        },
        fk_nit: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true, // La columna puede ser NULL
          field: 'fk_nit' // Nombre de la columna en la base de datos
        },
        fk_cc_Empleado: {
          type: DataTypes.STRING(15),
          allowNull: true, // La columna puede ser NULL
          field: 'fk_cc_Empleado' // Nombre de la columna en la base de datos
        },
      },
      {
        sequelize,
        tableName: 'cita',
        timestamps: false,
        underscored: true, // Utilizar nombres de columna en snake_case
      }
    );
  }
}

export default Cita;
