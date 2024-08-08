import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';
import bcrypt from 'bcrypt';

interface UserAttributes {
  cedula: number;
  nombre: string;
  apellido: string;
  correo: string;
  contraseña: string;
  direccion: string;
  telefono: string;
  estado: boolean;
  role: string;
  imagen: string;
}


class User extends Model<UserAttributes> implements UserAttributes {
  public cedula!: number;
  public nombre!: string;
  public apellido!: string;
  public correo!: string;
  public contraseña!: string;
  public direccion!: string;
  public telefono!: string;
  public estado!: boolean;
  public role!: string;
  public imagen!: string;




  static initModel(): void {
    this.init(
      {
        cedula: {
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
        correo: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        contraseña: {
          type: DataTypes.STRING(60),
          allowNull: false,
        },
        direccion: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        telefono: {
          type: DataTypes.STRING(12),
          allowNull: true,
        },
        estado: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: true,
        },
        role: {
          type: DataTypes.STRING,
          defaultValue: 'User',
          allowNull: true,
        },
        imagen: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'usuario',
        timestamps: false,
        underscored: true,
        hooks: {
          beforeCreate: async (user: User) => {
            const salt = await bcrypt.genSalt(10);
            user.contraseña = await bcrypt.hash(user.contraseña, salt);
          },
        },
      }
    );
  }
}

export default User;