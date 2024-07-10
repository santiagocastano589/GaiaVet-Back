import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface ProductoAttributes {
  idProducto: number;
  nombreProducto: string;
  categoria: string;
  descripcion: string;
  stock: number;
  precio: number;
  fk_idServicioP: number;
}

class Producto extends Model<ProductoAttributes> implements ProductoAttributes {
  public idProducto!: number;
  public nombreProducto!: string;
  public categoria!: string;
  public descripcion!: string;
  public stock!: number;
  public precio!: number;
  public fk_idServicioP!: number;

  static initModel(): void {
    this.init(
      {
        idProducto: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
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
          allowNull: false,
        },
        precio: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        fk_idServicioP: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'servicio', // Nombre de la tabla de referencia
            key: 'idServicio',
          },
        },
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
