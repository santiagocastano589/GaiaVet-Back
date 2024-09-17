import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection';

class HistorialMedico extends Model {
  public idHistorial!: number;
  public idMascotaH!: number;
  public encargadoAtencion!: string | null;
  public fechaCita!: Date | null;
  public observaciones!: string | null;
  public valorCita!: number | null;
}

HistorialMedico.init({
  idHistorial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idMascotaH: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  encargadoAtencion: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  fechaCita: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  valorCita: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'HistorialMedico',
  timestamps: false,
});

export default HistorialMedico;
