import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database.js';

class EtfHistory extends Model<InferAttributes<EtfHistory>, InferCreationAttributes<EtfHistory>> {
  declare date: string;
  declare assetType: string;
  declare totalNetInflow: number;
  declare dailyNetInflow: number;
  declare cumulativeNetInflow: number;
  declare totalNetAssets: number;
}

EtfHistory.init({
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    primaryKey: true
  },
  assetType: { // 'btc' ou 'eth' - Agregado por tipo de ativo
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  totalNetInflow: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  dailyNetInflow: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  cumulativeNetInflow: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalNetAssets: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'EtfHistory',
  tableName: 'etf_histories',
  indexes: [
    {
      unique: true,
      fields: ['date', 'assetType']
    }
  ]
});

export default EtfHistory;
