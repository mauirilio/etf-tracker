import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { syncDatabase, EtfSnapshot, EtfHistory } from './models/index.js';
import { runFullSync } from './services/syncService.js';
import { Op } from 'sequelize';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint para dados atuais (Snapshot)
app.get('/api/etf/current', async (req, res) => {
  try {
    const { type } = req.query; // 'btc' ou 'eth'
    const whereClause: any = type ? { assetType: type } : {};
    
    // Pega o snapshot mais recente (filtrando pela data de hoje ou mais recente disponível)
    // Como simplificação, pegamos tudo do tipo solicitado e o frontend filtra ou o backend faz query mais complexa
    // Vamos pegar todos os registros da data mais recente disponível no banco para aquele ativo
    
    const latestDateRecord = await EtfSnapshot.findOne({
      where: whereClause,
      order: [['date', 'DESC']]
    });

    if (!latestDateRecord) {
      return res.json({ list: [] });
    }

    const data = await EtfSnapshot.findAll({
      where: {
        ...whereClause,
        date: latestDateRecord.date
      }
    });

    // Mapeia para o formato que o frontend espera (similar ao Soso API para facilitar migração)
    const formattedData = data.map((item: any) => ({
      ...item.toJSON(),
      // Reconverte números para strings formatadas se o frontend esperar assim, 
      // mas idealmente o frontend deve lidar com números.
      // O frontend atual espera objetos com .value para alguns campos.
      // Vamos ajustar o frontend depois, por enquanto retornamos estrutura limpa.
      // Para compatibilidade imediata com frontend existente (que espera .value em netAssets etc):
      netAssets: { value: item.netAssets },
      dailyNetInflow: { value: item.dailyNetInflow },
      totalNetInflow: { value: item.totalNetInflow },
      volume: { value: item.volume },
      marketPrice: { value: item.marketPrice }
    }));

    res.json({ list: formattedData });
  } catch (error) {
    console.error('Erro ao buscar dados atuais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para histórico
app.get('/api/etf/history', async (req, res) => {
  try {
    const { type } = req.query;
    const whereClause: any = type ? { assetType: type } : {};

    const history = await EtfHistory.findAll({
      where: whereClause,
      order: [['date', 'ASC']]
    });

    // Formato compatível com o esperado pelo frontend
    const formattedHistory = history.map((item: any) => ({
      date: item.date,
      totalNetInflow: item.dailyNetInflow, // Atenção ao mapeamento
      cumulativeNetInflow: item.cumulativeNetInflow,
      totalNetAssets: item.totalNetAssets
    }));

    res.json({ data: formattedHistory });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para forçar sincronização manual
app.post('/api/sync', async (req, res) => {
    try {
        await runFullSync();
        res.json({ message: 'Sincronização iniciada/concluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro na sincronização' });
    }
});

// Inicialização
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  
  await syncDatabase();
  
  // Executa sync inicial ao subir para não ficar com banco vazio
  runFullSync(); 

  // Ageda sync 2x ao dia (08:00 e 20:00)
  cron.schedule('0 8,20 * * *', () => {
    console.log('Executando tarefa agendada de sincronização (08:00/20:00)...');
    runFullSync();
  });
});
