import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbOptions: Options = {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: false,
  port: parseInt(process.env.DB_PORT || '5432', 10),
};

if (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') {
  dbOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'etfs-2025',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'postgres',
  dbOptions
);

export default sequelize;
