import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface MascotaAttributes {
  idMascota: number;
  nombre: string;
  edad: number;
  raza: string;
  peso: number;
  temperamento: string;
  foto: Blob; 
  fk_cedulaU: string;
}

class Mascota extends Model<MascotaAttributes> implements MascotaAttributes {
  public idMascota!: number;
  public nombre!: string;
  public edad!: number;
  public raza!: string;
  public peso!: number;
  public temperamento!: string;
  public foto!: Blob;
  public fk_cedulaU!: string;

  static initModel(): void {
    this.init(
      {
        idMascota: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        edad: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        raza: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        peso: {
          type: DataTypes.DOUBLE(5, 2),
          allowNull: false,
        },
        temperamento: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        foto: {
          type: DataTypes.BLOB('medium'),
          allowNull: true,
        },
        fk_cedulaU: {
          type: DataTypes.STRING(15),
          allowNull: false,
          references: {
            model: 'usuario', 
            key: 'cedula',
          },
        },
      },
      {
        sequelize,
        tableName: 'mascota', 
        timestamps: false,
        underscored: true, 
      }
    );
  }
}

export default Mascota;
