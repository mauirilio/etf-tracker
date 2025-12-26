import { useState, useEffect, useCallback } from 'react';
import { getEtfData, getEtfHistory, getMarketCap } from '../services/apiService';
import { getCorrectEtfName } from '../utils/etfNameMapping';
import type { EtfData, EtfHistory, AssetType } from '../types/etfTypes';

export const useEtfData = (selectedAsset: AssetType) => {
    const [data, setData] = useState<EtfData[]>([]);
    const [history, setHistory] = useState<EtfHistory[]>([]);
    const [marketCap, setMarketCap] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const assetIds = selectedAsset === 'btc' ? ['bitcoin'] : selectedAsset === 'eth' ? ['ethereum'] : ['solana'];
            const results = await Promise.allSettled([
                getEtfData(selectedAsset),
                getEtfHistory(selectedAsset, 'day'),
                getMarketCap(assetIds)
            ]);

            if (results[0].status === 'fulfilled') {
                // Aplica correção de nomes dos ETFs
                const correctedData = results[0].value.map((etf: EtfData) => ({
                    ...etf,
                    institute: getCorrectEtfName(etf.ticker, etf.institute)
                }));
                setData(correctedData);
            } else {
                console.error("Falha ao buscar dados de ETF:", results[0].reason);
                setError(prev => prev ? `${prev}\nFalha ao buscar dados de ETF.` : 'Falha ao buscar dados de ETF.');
            }

            if (results[1].status === 'fulfilled') {
                setHistory(results[1].value);
            } else {
                console.error("Falha ao buscar histórico de ETF:", results[1].reason);
                setError(prev => prev ? `${prev}\nFalha ao buscar histórico de ETF.` : 'Falha ao buscar histórico de ETF.');
            }

            if (results[2].status === 'fulfilled') {
                setMarketCap(results[2].value);
            } else {
                console.error("Falha ao buscar capitalização de mercado:", results[2].reason);
                // Não definimos um erro geral para a falha do market cap, pois pode ser menos crítico
            }

        } catch (err: any) {
            const errorMessage = err.message || 'Ocorreu um erro desconhecido ao buscar os dados.';
            console.error("Falha ao buscar dados:", err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [selectedAsset]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, history, marketCap, loading, error, fetchData };
};