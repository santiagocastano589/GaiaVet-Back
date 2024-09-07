import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';
import bcrypt from 'bcrypt';


interface EmpleadoAttributes {
  cedulaEmpleado: string;
  nombre: string;
  apellido: string;
  edad: number;
  tiempoExp: string;
  correo: string;
  contraseña: string;
  role:string;
  estado:boolean;
  cargo:string;
  foto:string;
}

class Empleado extends Model<EmpleadoAttributes> implements EmpleadoAttributes {
  public cedulaEmpleado!: string;
  public nombre!: string;
  public apellido!: string;
  public edad!: number;
  public tiempoExp!: string;
  public correo!: string;
  public contraseña!: string;
  public role!: string;
  public estado!: boolean;
  public cargo!: string;
  public foto!:string;



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
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        contraseña: {
          type: DataTypes.STRING(60),
          allowNull: false,
        },
        role:{
          type:DataTypes.STRING(20),
          defaultValue:'Empleado'
        },
        cargo:{
          type:DataTypes.STRING(30),
        },
        foto:{
          type:DataTypes.STRING(500)
        },
        estado:{
          type:DataTypes.BOOLEAN,
          defaultValue:true
        }
      },
      {
        sequelize,
        tableName: 'empleado', // Nombre de la tabla en MySQL
        timestamps: false ,// Deshabilitar campos createdAt y updatedAt
        hooks: {
          beforeCreate: async (user: Empleado) => {
            const salt = await bcrypt.genSalt(10);
            user.contraseña = await bcrypt.hash(user.contraseña, salt);
          },
        },
      }
    );
  }
}

export default Empleado;
