import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';
import bcrypt from 'bcrypt';

interface AdminAttributtes {
  nit: number;
  nombre: string;
  correo: string;
  contraseña: string;
  direccion: string;
  telefono: string;
  role:string;
}

class Admin extends Model<AdminAttributtes> implements AdminAttributtes {
  public nit!: number;
  public nombre!: string;
  public correo!: string;
  public contraseña!: string;
  public direccion!: string;
  public telefono!: string;
  public role!: string;


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
        hooks: {
          beforeCreate: async (user: Admin) => {
            const salt = await bcrypt.genSalt(10);
            user.contraseña = await bcrypt.hash(user.contraseña, salt);
          },
        },
      }
    );
  }
}

export default Admin;