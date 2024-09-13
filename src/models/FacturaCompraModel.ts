import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface fCompraAttributes {
  idFacturaC?: number;
  fecha: String;
  subtotal?: number;
  total:number,
  fk_cedula: string;
}

class fCompra extends Model<fCompraAttributes> implements fCompraAttributes {
  public idFacturaC!: number;  // Auto-incrementable en la base de datos
  public fecha!: String;
  public subtotal?: number;
  public total!: number;
  public fk_cedula!: string;

  static initModel(): void {
    this.init(
      {
        idFacturaC: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,  // Auto-incrementable
        },
        fecha: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        subtotal: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        }, 
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
        fk_cedula: {
          type: DataTypes.STRING(20),
          allowNull: false,
          references:{
            model:'usuario',
            key:'cedula'
          },
        }
      },
      {
        sequelize,
        tableName: 'facturaCompra',  // Nombre de la tabla
        timestamps: false,     
      }
    );
  }
}

export default fCompra;
