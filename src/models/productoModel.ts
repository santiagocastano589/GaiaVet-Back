import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface ProductoAttributes {
  idProducto: number;
  imagen?:string;
  nombreProducto: string;
  categoria: string;
  descripcion:string;
  stock: number;
  precio: number;
}

class Producto extends Model<ProductoAttributes> implements ProductoAttributes {
  public idProducto!: number;
  public imagen!:string;
  public nombreProducto!: string;
  public categoria!: string;
  public descripcion!: string;
  public stock!: number;
  public precio!: number;
 

  static initModel(): void {
    this.init(
      {
        idProducto: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
          field:'idProducto'
        },
        imagen:{
          type:DataTypes.STRING(30),
          allowNull:true,
          field:'imagen'
        },
        nombreProducto: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field:'nombreProducto'
        },
        categoria: {
          type: DataTypes.STRING(30),
          allowNull: false,
          field:'categoria'
        },
        descripcion:{
          type:DataTypes.STRING(50),
          allowNull:false,
          field:'descripcion'
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field:'stock'
        },
        precio: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field:'precio'
        }
      },
      {
        sequelize,
        tableName: 'producto', // Nombre de la tabla en MySQL
        timestamps: false, // Deshabilitar campos createdAt y updatedAt
        underscored: true, // Utilizar nombres de columna en snake_case
      }
    );
  }
}

export default Producto;
