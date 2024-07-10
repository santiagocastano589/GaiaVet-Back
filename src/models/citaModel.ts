import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface CitaAttributes {
  idCita: number;
  tipoCita: string;
  fechaHoraCita: Date;
  tipoMascota: string;
  estadoCita: string;
  fk_idServicioC: number;
}

class Cita extends Model<CitaAttributes> implements CitaAttributes {
  public idCita!: number;
  public tipoCita!: string;
  public fechaHoraCita!: Date;
  public tipoMascota!: string;
  public estadoCita!: string;
  public fk_idServicioC!: number;

  static initModel(): void {
    this.init(
      {
        idCita: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        tipoCita: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        fechaHoraCita: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        tipoMascota: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        estadoCita: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        fk_idServicioC: {
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
        tableName: 'cita', // Nombre de la tabla en MySQL
        timestamps: false, // Deshabilitar campos createdAt y updatedAt
        underscored: true, // Utilizar nombres de columna en snake_case
      }
    );
  }
}

export default Cita;
