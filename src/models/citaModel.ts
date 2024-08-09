import { DataTypes, Model, STRING } from 'sequelize';
import sequelize from '../db/connection';

interface CitaAttributes {
  idCita: number;
  tipoCita: string;
  fechaHoraCita: Date;
  tipoMascota: string;
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
          values:['Pendiente','Cancelada','Confirmada','Terminada'],
          defaultValue:"Pendiente"
        },
        fk_cc_usuario:{
          type: DataTypes.STRING(15),
          allowNull: false,
          references:{
            model:'usuario',
            key:'cedula'
          },
        },
        fk_nit:{
          type:DataTypes.INTEGER.UNSIGNED,
          allowNull:false,
          references:{
            model:'veterinaria',
            key:'nit'
          },

        },
        fk_cc_Empleado:{
          type:DataTypes.STRING(12),
          allowNull:false,
          references:{
            model:'empleado',
            key:'cedulaEmpleado'
          },
        }

      
      },
      {
        sequelize,
        tableName: 'cita', 
        timestamps: false, 
        underscored: true, 
      }
    );
  }
}

export default Cita;
