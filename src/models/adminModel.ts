import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface AdminAttributtes {
  nit: number;
  nombre: string;
  correo: string;
  contraseña: string;
  direccion: string;
  telefono: string;
  role:string;
  estado:boolean;
}

class Admin extends Model<AdminAttributtes> implements AdminAttributtes {
  public nit!: number;
  public nombre!: string;
  public correo!: string;
  public contraseña!: string;
  public direccion!: string;
  public telefono!: string;
  public role!: string;
  public estado!: boolean;



  static initModel(): void {
    this.init(
      {
        nit: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        correo: {
          type: DataTypes.STRING(60),
          allowNull: false,
        },
        contraseña: {
          type: DataTypes.STRING(60),
          allowNull: false,
        },
        direccion: {
          type: DataTypes.STRING(60),
          allowNull: true,
        },
        telefono: {
          type: DataTypes.STRING(12),
          allowNull: true,
        },
        estado:{
          type:DataTypes.BOOLEAN,
          defaultValue:true
        },
        role:{
          type:DataTypes.STRING(20),
          defaultValue:'administrador'
        }
       
      },
      {
        sequelize,
        tableName: 'veterinaria', 
        timestamps: false, 
        underscored: true, 
      }
    );
  }
}

export default Admin;