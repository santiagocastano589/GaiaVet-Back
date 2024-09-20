import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import Cita from '../models/citaModel';  // Asumo que tienes un modelo de Cita

class Factura extends Model {
  public idFactura?: number;
  public tipoFactura!: string;
  public fechaFactura!: Date;
  public total!: number;
  public fk_nit!: string;
  public fk_idCita!: number;
}

Factura.init({
  idFactura: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipoFactura: {
    type: DataTypes.STRING(20), 
    allowNull: false,
  },
  fechaFactura: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2), // Permite manejar montos con dos decimales
    allowNull: false,
  },
  fk_nit: {
    type: DataTypes.STRING(15), // Para manejar el formato de NIT
    allowNull: false,
  },
  fk_idCita: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cita', // Nombre de la tabla Cita
      key: 'idCita', // Clave primaria de Cita
    },
   
  },
  metodo:{
    type:DataTypes.STRING(45),
    allowNull:false,

  }
}, {
  sequelize,
  tableName: 'facturaVenta',
  timestamps: false, // Desactiva los timestamps automáticos
});

export default Factura;
