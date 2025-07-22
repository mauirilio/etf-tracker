import axios from 'axios';

const SOSO_API_KEY = import.meta.env.VITE_SOSO_API_KEY;
const SOSO_BASE_URL = "https://api.sosovalue.xyz/openapi/v2";
const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const sosoApiClient = axios.create({
    baseURL: SOSO_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "x-soso-api-key": SOSO_API_KEY
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
    console.error(context, error);
    if (axios.isAxiosError(error)) {
        // Erros vindos da requisição (rede, status code, etc.)
        return new Error(`API Error in ${context}: ${error.response?.data?.message || error.message}`);
    } else if (error instanceof Error) {
        // Erros lançados intencionalmente ou outros erros de runtime
        return new Error(`Application Error in ${context}: ${error.message}`);
    } else {
        // Casos inesperados
        return new Error(`An unknown error occurred in ${context}`);
    }
};

export const getEtfData = async (assetType: 'btc' | 'eth') => {
    try {
        const response = await sosoApiClient.post('/etf/currentEtfDataMetrics', {
            type: `us-${assetType}-spot`
        });
        console.log('getEtfData response:', response.data);
        // Resposta da API com erro de negócio
        if (response.data.code !== 0) {
            throw new Error(response.data.message || 'Failed to fetch ETF data');
        }
        // Resposta bem-sucedida, mas com estrutura de dados inesperada
        return response.data.data?.list || [];
    } catch (error) {
        throw handleError(error, `getEtfData(${assetType})`);
    }
};

export const getEtfHistory = async (assetType: 'btc' | 'eth', cycle: 'day' | 'week' | 'month' = 'day') => {
    try {
        const response = await sosoApiClient.post('/etf/historicalInflowChart', {
            type: `us-${assetType}-spot`,
            cycle: cycle
        });
        console.log('getEtfHistory response:', response.data);
        // Resposta da API com erro de negócio
        if (response.data.code !== 0) {
            throw new Error(response.data.message || 'Failed to fetch ETF history');
        }
        // Resposta bem-sucedida, mas com estrutura de dados inesperada
        return response.data.data || [];
    } catch (error) {
        throw handleError(error, `getEtfHistory(${assetType}, ${cycle})`);
    }
};

export const getMarketCap = async (assetIds: string[]) => {
    try {
        const response = await coingeckoApiClient.get('/simple/price', {
            params: {
                ids: assetIds.join(','),
                vs_currencies: 'usd',
                include_market_cap: 'true'
            }
        });
        console.log('getMarketCap response:', response.data);
        return response.data;
    } catch (error) {
        throw handleError(error, `getMarketCap(${assetIds.join(',')})`);
    }
};