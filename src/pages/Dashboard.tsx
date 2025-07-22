import { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getEtfData, getEtfHistory, getMarketCap } from '../services/apiService';
import type { EtfData, EtfHistory } from '../types/etfTypes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FiRefreshCw } from 'react-icons/fi';
import SummaryCardSkeleton from '../components/skeletons/SummaryCardSkeleton';
import ChartSkeleton from '../components/skeletons/ChartSkeleton';
import './Dashboard.css';

const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g,"")) : value;

    if (typeof numValue !== 'number' || isNaN(numValue)) {
        return '$0.00';
    }

    const sign = numValue < 0 ? '-' : '';
    const absValue = Math.abs(numValue);

    if (absValue >= 1e9) {
        return `${sign}$${(absValue / 1e9).toFixed(2)}B`;
    } else if (absValue >= 1e6) {
        return `${sign}$${(absValue / 1e6).toFixed(2)}M`;
    }
    return `${sign}$${absValue.toFixed(2)}`;
};

interface DashboardProps {
  theme: string;
  toggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ theme, toggleTheme }) => {
    const [positiveColor, setPositiveColor] = useState('#28a745');
    const [negativeColor, setNegativeColor] = useState('#dc3545');

    useEffect(() => {
        const style = getComputedStyle(document.documentElement);
        const positive = style.getPropertyValue(theme === 'dark' ? '--positive-flow-dark' : '--positive-flow-light').trim();
        const negative = style.getPropertyValue(theme === 'dark' ? '--negative-flow-dark' : '--negative-flow-light').trim();
        setPositiveColor(positive || '#28a745');
        setNegativeColor(negative || '#dc3545');
    }, [theme]);
    const [selectedAsset, setSelectedAsset] = useState<'btc' | 'eth'>('btc');
    const [data, setData] = useState<EtfData[]>([]);
    const [history, setHistory] = useState<EtfHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [timeRange, setTimeRange] = useState<'Diário' | 'Semanal' | 'Mensal' | 'Personalizado'>('Diário');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [marketCap, setMarketCap] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const assetIds = selectedAsset === 'btc' ? ['bitcoin'] : ['ethereum'];
            const [dataRes, historyRes, marketCapRes] = await Promise.all([
                getEtfData(selectedAsset),
                getEtfHistory(selectedAsset, 'day'),
                getMarketCap(assetIds)
            ]);

            setData(dataRes);
            setHistory(historyRes);
            setMarketCap(marketCapRes);

        } catch (err: any) {
            console.error("Falha ao buscar dados:", err);
            throw new Error(err.message || 'Ocorreu um erro desconhecido ao buscar os dados.');
        } finally {
            setLoading(false);
        }
    }, [selectedAsset]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);



    const totalNetAssets = data.reduce((acc, etf) => acc + parseFloat(etf.netAssets.value), 0);
    const assetMarketCap = marketCap && marketCap[selectedAsset === 'btc' ? 'bitcoin' : 'ethereum']?.usd_market_cap;
    const marketCapPercentage = assetMarketCap ? (totalNetAssets / assetMarketCap) * 100 : 0;

    const [startDate, endDate] = dateRange;

    const baseSortedHistory = [...history]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const lastDayNetFlow = baseSortedHistory.length > 0 ? parseFloat(baseSortedHistory[baseSortedHistory.length - 1].totalNetInflow) : 0;

    const getChartData = () => {
        let historyToProcess = baseSortedHistory;

        if (timeRange === 'Personalizado' && startDate && endDate) {
            historyToProcess = baseSortedHistory.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= startDate && itemDate <= endDate;
            });
            return historyToProcess.map(item => ({
                date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }),
                flow: parseFloat(item.totalNetInflow) / 1e6,
            }));
        }

        if (timeRange === 'Mensal') {
            const monthlyData = historyToProcess.reduce((acc, item) => {
                const date = new Date(item.date);
                const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
                if (!acc[monthKey]) {
                    acc[monthKey] = 0;
                }
                acc[monthKey] += parseFloat(item.totalNetInflow);
                return acc;
            }, {} as Record<string, number>);

            return Object.entries(monthlyData).map(([dateKey, flow]) => {
                const [year, month] = dateKey.split('-');
                const date = new Date(Date.UTC(Number(year), Number(month) - 1, 2));
                return {
                    date: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' }),
                    flow: flow / 1e6,
                };
            });
        }

        if (timeRange === 'Semanal') {
            const weeklyData = historyToProcess.reduce((acc, item) => {
                const itemDate = new Date(item.date);
                const dayOfWeek = itemDate.getUTCDay() === 0 ? 6 : itemDate.getUTCDay() - 1; // Monday = 0
                const firstDayOfWeek = new Date(itemDate);
                firstDayOfWeek.setUTCDate(itemDate.getUTCDate() - dayOfWeek);
                const weekKey = `${firstDayOfWeek.getUTCFullYear()}-${String(firstDayOfWeek.getUTCMonth() + 1).padStart(2, '0')}-${String(firstDayOfWeek.getUTCDate()).padStart(2, '0')}`;

                if (!acc[weekKey]) {
                    acc[weekKey] = 0;
                }
                acc[weekKey] += parseFloat(item.totalNetInflow);
                return acc;
            }, {} as Record<string, number>);

            return Object.entries(weeklyData).map(([dateKey, flow]) => {
                const [year, month, day] = dateKey.split('-');
                const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
                return {
                    date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }),
                    flow: flow / 1e6,
                };
            });
        }

        // Diário
        if (timeRange === 'Diário') {
            historyToProcess = historyToProcess.slice(-30);
        }

        return historyToProcess.map(item => {
            const date = new Date(item.date);
            return {
                date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }),
                flow: parseFloat(item.totalNetInflow) / 1e6,
            };
        });
    };

    const chartData = getChartData();

    if (loading) {
        return (
            <div className="dashboard">
                <div className="header">
                    <div className="asset-selector">
                        <button className="active skeleton-button" style={{ width: '120px', height: '40px' }}></button>
                        <button className="skeleton-button" style={{ width: '120px', height: '40px' }}></button>
                    </div>
                    <div className="skeleton refresh-button" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
                </div>
                <div className="summary-cards">
                    <div className="top-summary-cards">
                        <SummaryCardSkeleton />
                        <SummaryCardSkeleton />
                    </div>
                </div>
                <div className="main-content">
                    <ChartSkeleton />
                </div>
            </div>
        );
    }



    return (
        <div className="dashboard">
            <div className="header">
                <div className="asset-selector">
                    <button className={selectedAsset === 'btc' ? 'active' : ''} onClick={() => setSelectedAsset('btc')}>Bitcoin (BTC)</button>
                    <button className={selectedAsset === 'eth' ? 'active' : ''} onClick={() => setSelectedAsset('eth')}>Ethereum (ETH)</button>
                </div>
                <div className="header-right">
                    <button onClick={() => fetchData()} className="refresh-button" disabled={loading}>
                        <FiRefreshCw /> Atualizar
                    </button>
                    <div className="theme-switcher">
                        <label className="switch">
                            <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="summary-cards">
                <div className="top-summary-cards">
                    <div className="summary-card">
                        <h3>Fluxo Líquido (Último dia)</h3>
                        <p className={lastDayNetFlow >= 0 ? 'positive-flow' : 'negative-flow'}>{formatCurrency(lastDayNetFlow)}</p>
                    </div>


                    <div className="summary-card">
                        <h3>Ativos Líquidos Totais</h3>
                        <p className='positive-flow'>
                            {formatCurrency(totalNetAssets)}
                            {marketCapPercentage > 0 && (
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-color-secondary)', marginLeft: '8px' }}>
                                    ({marketCapPercentage.toFixed(2)}% do cap. de mercado)
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="chart-container">
                    <div className="chart-header">
                        <h2>Fluxo Líquido Total</h2>
                        <div className="time-selector">
                            <button className={timeRange === 'Diário' ? 'active' : ''} onClick={() => { setTimeRange('Diário'); setDateRange([null, null]); }}>Diário</button>
                            <button className={timeRange === 'Semanal' ? 'active' : ''} onClick={() => { setTimeRange('Semanal'); setDateRange([null, null]); }}>Semanal</button>
                            <button className={timeRange === 'Mensal' ? 'active' : ''} onClick={() => { setTimeRange('Mensal'); setDateRange([null, null]); }}>Mensal</button>
                            <DatePicker
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange(update);
                                    if (update[0] && update[1]) {
                                        setTimeRange('Personalizado');
                                    }
                                }}
                                isClearable={true}
                                placeholderText="Selecione um período"
                                className={`datepicker-input ${timeRange === 'Personalizado' ? 'active' : ''}`}
                            />
                        </div>
                    </div>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={600}>
                            <BarChart data={chartData} margin={{ top: 20, right: 40, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(value) => `$${value}M`} />
                                <Tooltip formatter={(value: number) => [formatCurrency(value * 1e6), 'Fluxo']} />
                                <Bar dataKey="flow">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.flow >= 0 ? positiveColor : negativeColor} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-color-secondary)' }}>
                            <h3>Sem dados para o período selecionado.</h3>
                            <p>Por favor, ajuste o filtro de tempo ou tente novamente mais tarde.</p>
                        </div>
                    )}
                </div>
                <div className="summary-card etf-flow-card">
                    <h3>Fluxo por ETF</h3>
                    {data.map((etf, index) => (
                        <div key={etf.ticker} className="etf-list-item">
                            <div className="etf-info">
                                <div className="color-dot" style={{ backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#007bff', '#6f42c1', '#fd7e14', '#20c997', '#6610f2', '#e83e8c'][index % 9] }}></div>
                                <span>{etf.ticker}</span>
                            </div>
                            <span className={`etf-flow-value ${etf.dailyNetInflow.value >= 0 ? 'positive-flow' : 'negative-flow'}`}>{formatCurrency(etf.dailyNetInflow.value)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

};

export default Dashboard;