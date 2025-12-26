import axios from 'axios';
import type { AssetType } from '../types/etfTypes';

// URL do nosso backend (usa variável de ambiente em prod ou localhost em dev)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"; // URL direta para produção

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

const coingeckoApiClient = axios.create({
    baseURL: COINGECKO_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Função para formatar erros de maneira consistente
const handleError = (error: unknown, context: string) => {
    if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.error || error.message;
        return new Error(`API Error in ${context}: ${apiMessage}`);
    } else if (error instanceof Error) {
        return new Error(`Application Error in ${context}: ${error.message}`);
    } else {
        return new Error(`An unknown error occurred in ${context}`);
    }
};

export const getEtfData = async (assetType: AssetType) => {
    try {
        // Chamada para o nosso backend
        const response = await apiClient.get('/etf/current', {
            params: { type: assetType }
        });
        
        // O backend retorna { list: [...] }
        return response.data.list || [];
    } catch (error) {
        throw handleError(error, `getEtfData(${assetType})`);
    }
};

export const getEtfHistory = async (assetType: AssetType, cycle: 'day' | 'week' | 'month' = 'day') => {
    try {
        // Chamada para o nosso backend
        // Nota: O backend atual suporta apenas dados diários no banco (history), 
        // a agregação semanal/mensal deve ser feita no frontend ou implementada no backend.
        // O frontend original já fazia agregação local para semanal/mensal se recebesse diário?
        // Verificando Dashboard.tsx: Sim, o Dashboard calcula 'Mensal' e 'Semanal' a partir do histórico completo.
        // Então basta retornar o histórico diário completo.
        
        const response = await apiClient.get('/etf/history', {
            params: { type: assetType }
        });

        return response.data.data || [];
    } catch (error) {
        throw handleError(error, `getEtfHistory(${assetType}, ${cycle})`);
    }
};

export const getMarketCap = async (assetIds: string[], retries: number = 2): Promise<any> => {
    try {
        const response = await coingeckoApiClient.get('/simple/price', {
            params: {
                ids: assetIds.join(','),
                vs_currencies: 'usd',
                include_market_cap: 'true'
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429 && retries > 0) {
            console.warn(`Rate limit atingido para getMarketCap. Tentando novamente em 2 segundos... (${retries} tentativas restantes)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return getMarketCap(assetIds, retries - 1);
        }
        
        if (axios.isAxiosError(error) && error.response?.status === 429) {
            console.warn('Rate limit persistente na API CoinGecko. Usando dados padrão.');
            return null;
        }
        
        throw handleError(error, `getMarketCap(${assetIds.join(',')})`);
    }
};

// Função para disparar sincronização manual (útil para botão "Atualizar" no frontend)
export const syncData = async () => {
    try {
        await apiClient.post('/sync');
        return true;
    } catch (error) {
        console.error("Falha ao solicitar sincronização:", error);
        return false;
    }
};
