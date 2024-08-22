import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface MascotaAttributes {
  idMascota?: number;
  nombre: string;
  edad: number;
  raza: string;
  TipoMascota: string;
  peso: number;
  temperamento: string;
  foto: Blob; 
  fk_cedulaU: string;
  Estado:boolean;
}

class Mascota extends Model<MascotaAttributes> implements MascotaAttributes {
  public idMascota!: number;
  public nombre!: string;
  public edad!: number;
  public raza!: string;
  public TipoMascota!: string;
  public peso!: number;
  public temperamento!: string;
  public foto!: Blob;
  public fk_cedulaU!: string;
  public Estado!: boolean;

  

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
        TipoMascota: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        peso: {
          type: DataTypes.DOUBLE(5, 2),
          allowNull: false,
        },
        Estado:{
          type:DataTypes.BOOLEAN,
          allowNull:true,
          defaultValue:true,

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
      }
    );
  }
}

export default Mascota;
