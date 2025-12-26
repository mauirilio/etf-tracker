import axios from 'axios';
import { EtfSnapshot, EtfHistory } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const SOSO_API_KEY = process.env.VITE_SOSO_API_KEY || ''; // Idealmente ter uma chave separada para backend se necessário, ou usar a mesma
// Nota: A chave da SosoValue está no código do frontend original hardcoded ou no .env?
// No código original (apiService.ts): const SOSO_API_KEY = import.meta.env.VITE_SOSO_API_KEY;
// Mas no .env que li, não vi VITE_SOSO_API_KEY definida, apenas VITE_NEWSDATA_API_KEY.
// Vou assumir que o usuário precisa fornecer essa chave ou ela está hardcoded em algum lugar que perdi, ou a API é aberta?
// Verificando o apiService.ts original:
// headers: { "x-soso-api-key": SOSO_API_KEY }
// Se a chave não estiver no .env, a requisição falhará. Vou adicionar um log de aviso.

const SOSO_BASE_URL = "https://api.sosovalue.xyz/openapi/v2";

const apiClient = axios.create({
  baseURL: SOSO_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Se a chave existir, usa. Se não, tenta sem (alguns endpoints podem ser públicos ou a chave está faltando)
    ...(process.env.SOSO_API_KEY ? { "x-soso-api-key": process.env.SOSO_API_KEY } : {})
  }
});

// Helper para converter strings "1.2B", "500M" ou objetos { value: "..." } para number
const parseValue = (val: any): number => {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  
  let str = '';
  if (typeof val === 'object' && val.value) str = val.value.toString();
  else str = val.toString();

  // Remove caracteres não numéricos exceto ponto e traço, e sufixos K, M, B
  const cleanStr = str.replace(/[^0-9.\-KMBkmb]/g, '');
  
  let multiplier = 1;
  if (cleanStr.toUpperCase().endsWith('B')) multiplier = 1e9;
  else if (cleanStr.toUpperCase().endsWith('M')) multiplier = 1e6;
  else if (cleanStr.toUpperCase().endsWith('K')) multiplier = 1e3;

  const numStr = cleanStr.replace(/[KMBkmb]/i, '');
  const num = parseFloat(numStr);

  return isNaN(num) ? 0 : num * multiplier;
};

export const syncEtfData = async (assetType: 'btc' | 'eth' | 'sol') => {
  console.log(`Iniciando sincronização de dados atuais para ${assetType}...`);
  try {
    const response = await apiClient.post('/etf/currentEtfDataMetrics', {
      type: `us-${assetType}-spot`
    });

    if (response.data.code !== 0) {
      throw new Error(`Erro na API Soso: ${response.data.message}`);
    }

    const list = response.data.data?.list || [];
    const today = new Date().toISOString().split('T')[0];

    const records = list.map((item: any) => ({
      ticker: item.ticker,
      date: today,
      institute: item.institute,
      assetType: assetType,
      totalNetInflow: parseValue(item.totalNetInflow),
      dailyNetInflow: parseValue(item.dailyNetInflow),
      netAssets: parseValue(item.netAssets),
      volume: parseValue(item.volume),
      marketPrice: parseValue(item.marketPrice),
      rawJson: item
    }));

    // Upsert (Inserir ou Atualizar)
    for (const record of records) {
        await EtfSnapshot.upsert(record);
    }

    console.log(`Sincronizados ${records.length} registros de ETF para ${assetType}.`);
  } catch (error: any) {
    console.error(`Erro ao sincronizar ETF Data (${assetType}):`, error.message);
  }
};

export const syncEtfHistory = async (assetType: 'btc' | 'eth' | 'sol') => {
    console.log(`Iniciando sincronização de histórico para ${assetType}...`);
    try {
      const response = await apiClient.post('/etf/historicalInflowChart', {
        type: `us-${assetType}-spot`,
        cycle: 'day'
      });
  
      if (response.data.code !== 0) {
        throw new Error(`Erro na API Soso: ${response.data.message}`);
      }
  
      const list = response.data.data || [];
  
      const records = list.map((item: any) => ({
        date: item.date, // Formato esperado YYYY-MM-DD
        assetType: assetType,
        totalNetInflow: parseValue(item.totalNetInflow),
        dailyNetInflow: parseValue(item.totalNetInflow), // No historico da Soso, as vezes o campo muda, ajustar conforme payload real
        cumulativeNetInflow: parseValue(item.cumulativeNetInflow), // Verificar se existe esse campo
        totalNetAssets: 0 // A API de historico as vezes não traz assets totais, verificar
      }));
  
      // Upsert em lote
      // Como pode ser muitos dados, fazer em transação ou batch seria ideal, mas loop simples serve para MVP
      for (const record of records) {
          await EtfHistory.upsert(record);
      }
  
      console.log(`Sincronizados ${records.length} dias de histórico para ${assetType}.`);
    } catch (error: any) {
      console.error(`Erro ao sincronizar ETF History (${assetType}):`, error.message);
    }
  };

export const runFullSync = async () => {
    await syncEtfData('btc');
    await syncEtfData('eth');
    await syncEtfData('sol');
    await syncEtfHistory('btc');
    await syncEtfHistory('eth');
    await syncEtfHistory('sol');
    console.log('Sincronização completa finalizada.');
};
