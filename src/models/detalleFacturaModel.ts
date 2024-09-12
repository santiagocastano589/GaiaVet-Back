import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface DetalleFacturaAttributes {
  idDetalle?: number;
  fk_idFacturaC: number;
  fk_idProducto: number;
  cantidad: number;
  precioUnitario: number;
}

class DetalleFactura extends Model<DetalleFacturaAttributes> implements DetalleFacturaAttributes {
  public idDetalle!: number;       // Auto-incrementable
  public fk_idFacturaC!: number;   // Llave foránea para la tabla facturaCompra
  public fk_idProducto!: number;   // Llave foránea para la tabla productos
  public cantidad!: number;        // Cantidad de productos
  public precioUnitario!: number;  // Precio unitario del producto

  static initModel(): void {
    this.init(
      {
        idDetalle: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        fk_idFacturaC: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references:{
            model:'facturaCompra',
            key:'idFacturaC'
          },
        },
        fk_idProducto: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references:{
            model:'producto',
            key:'idProducto'
          },
        },
        cantidad: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        precioUnitario: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'detalleFactura', // Nombre de la tabla en la base de datos
        timestamps: false,           // No utiliza `createdAt` ni `updatedAt`
      }
    );
  }
}

export default DetalleFactura;
