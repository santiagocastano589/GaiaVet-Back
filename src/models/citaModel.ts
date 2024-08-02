import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface CitaAttributes {
  idCita: number;
  tipoCita: string;
  fechaHoraCita: Date;
  tipoMascota: string;
  estadoCita: string;
  fk_cc_usuario: number;  
  fk_nit: number;
  fk_cc_Empleado: number; 
}

class Cita extends Model<CitaAttributes> implements CitaAttributes {
  public idCita!: number;
  public tipoCita!: string;
  public fechaHoraCita!: Date;
  public tipoMascota!: string;
  public estadoCita!: string;
  public fk_cc_usuario!: number;  
  public fk_nit!: number;
  public fk_cc_Empleado!: number; 

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
        fk_cc_usuario: {
          type: DataTypes.INTEGER.UNSIGNED,  
          allowNull: false,
          references: {
            model: 'usuario', 
            key: 'cedula',
          },
        },

        fk_nit: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'veterinaria', // Nombre de la tabla de referencia
            key: 'nit',
          },
        },
        fk_cc_Empleado: {
          type: DataTypes.INTEGER.UNSIGNED,  
          allowNull: false,
          references: {
            model: 'empleado', 
            key: 'cedulaEmpleado',
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
