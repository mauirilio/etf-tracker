import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega o .env da raiz do projeto
dotenv.config({ path: resolve(__dirname, '../../.env') });

const { Client } = pg;

const dbName = process.env.DB_NAME || 'etfs-2025';

console.log('Tentando conectar com:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: 'postgres',
});

async function setupDatabase() {
  try {
    await client.connect();
    
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
    
    if (res.rowCount === 0) {
      console.log(`Banco de dados '${dbName}' não encontrado. Criando...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Banco de dados '${dbName}' criado com sucesso.`);
    } else {
      console.log(`Banco de dados '${dbName}' já existe.`);
    }
  } catch (err) {
    console.error('Erro ao verificar/criar banco de dados:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
