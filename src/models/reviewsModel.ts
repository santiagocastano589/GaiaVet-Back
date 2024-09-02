import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

interface ReseñaAttributes {
  idReseña?: number;
  cedulaR: string;
  puntuacion: number;
  comentario: string;
  categoria: string;
  fk_idCita: number;
}

class Reseña extends Model<ReseñaAttributes> implements ReseñaAttributes {
  public idReseña?: number;
  public cedulaR!: string;
  public puntuacion!: number;
  public comentario!: string;
  public categoria!: string;
  public fk_idCita!: number;
  

  static initModel(): void {
    this.init(
      {
        idReseña: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        cedulaR: {
          type: DataTypes.STRING(15),
          allowNull: false,
        },
        puntuacion: {
          type: DataTypes.DOUBLE(2,1),
          allowNull: false,
        },
        comentario: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        categoria: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        fk_idCita: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'cita', 
            key: 'idCita',
          },
        },
      },
      {
        sequelize,
        tableName: 'reseña', 
        timestamps: false,
      }
    );
  }
}

export default Reseña;
