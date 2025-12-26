import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database.js';

class EtfSnapshot extends Model<InferAttributes<EtfSnapshot>, InferCreationAttributes<EtfSnapshot>> {
  declare ticker: string;
  declare date: string;
  declare institute: CreationOptional<string>;
  declare totalNetInflow: CreationOptional<number>;
  declare dailyNetInflow: CreationOptional<number>;
  declare netAssets: CreationOptional<number>;
  declare volume: CreationOptional<number>;
  declare marketPrice: CreationOptional<number>;
  declare assetType: string;
  declare rawJson: CreationOptional<any>;
}

EtfSnapshot.init({
  ticker: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  date: { // Data do snapshot (YYYY-MM-DD)
    type: DataTypes.DATEONLY,
    allowNull: false,
    primaryKey: true
  },
  institute: {
    type: DataTypes.STRING,
    allowNull: true
  },
  totalNetInflow: {
    type: DataTypes.FLOAT, // Armazenando o valor numérico puro
    defaultValue: 0
  },
  dailyNetInflow: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  netAssets: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  volume: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  marketPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  assetType: {
    type: DataTypes.STRING, // 'btc' ou 'eth'
    allowNull: false
  },
  rawJson: { // Backup do JSON original caso precisemos de campos extras depois
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'EtfSnapshot',
  tableName: 'etf_snapshots',
  indexes: [
    {
      unique: true,
      fields: ['ticker', 'date']
    }
  ]
});

export default EtfSnapshot;
