import EtfSnapshot from './EtfSnapshot.js';
import EtfHistory from './EtfHistory.js';
import sequelize from '../config/database.js';

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com banco de dados estabelecida com sucesso.');
    
    // Sincroniza os modelos com o banco (cria tabelas se não existirem)
    // Em produção, usar migrations em vez de sync({ force: true/alter: true })
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados com o banco de dados.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

export { EtfSnapshot, EtfHistory, sequelize, syncDatabase };
