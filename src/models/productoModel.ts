import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface ProductoAttributes {
  idProducto?: number;
  imagen?: string;
  nombreProducto: string;
  categoria: string;
  descripcion: string;
  stock: number;
  precio: number;
}

class Producto extends Model<ProductoAttributes> implements ProductoAttributes {
  public idProducto!: number;
  public imagen!: string;
  public nombreProducto!: string;
  public categoria!: string;
  public descripcion!: string;
  public stock!: number;
  public precio!: number;

  static initModel(): void {
    Producto.init(
      {
        idProducto: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        imagen: {
          type: DataTypes.STRING(1000),
          allowNull: true,
        },
        nombreProducto: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        categoria: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        descripcion: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        precio: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'producto',
        timestamps: false,
      }
    );
  }
}

export default Producto;
