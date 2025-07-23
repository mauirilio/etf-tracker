import { useState, useEffect } from 'react';
import type { EtfHistory } from '../types/etfTypes';
import { FiRefreshCw } from 'react-icons/fi';
import SummaryCardSkeleton from '../components/skeletons/SummaryCardSkeleton';
import ChartSkeleton from '../components/skeletons/ChartSkeleton';
import { useEtfData } from '../hooks/useEtfData';
import SummaryCards from '../components/SummaryCards';
import FlowChart from '../components/FlowChart';
import NewsFeed from '../components/NewsFeed';
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
    const [selectedAsset, setSelectedAsset] = useState<'btc' | 'eth'>('btc');
    const { data, history, marketCap, loading, error, fetchData } = useEtfData(selectedAsset);
    const [timeRange, setTimeRange] = useState<'Diário' | 'Semanal' | 'Mensal' | 'Personalizado'>('Diário');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

    useEffect(() => {
        const style = getComputedStyle(document.documentElement);
        const positive = style.getPropertyValue(theme === 'dark' ? '--positive-flow-dark' : '--positive-flow-light').trim();
        const negative = style.getPropertyValue(theme === 'dark' ? '--negative-flow-dark' : '--negative-flow-light').trim();
        setPositiveColor(positive || '#28a745');
        setNegativeColor(negative || '#dc3545');
    }, [theme]);



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

    if (error) {
        return (
            <div className="dashboard error-container">
                <div className="error-message">
                    <h3>Oops! Algo deu errado.</h3>
                    <p>{error}</p>
                    <button onClick={() => fetchData()} className="retry-button">
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

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
                <div className="news-feed-skeleton">
                    <div className="skeleton-title" style={{ width: '200px', height: '32px', marginBottom: '16px' }}></div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="skeleton-news-card" style={{ height: '250px' }}></div>
                        <div className="skeleton-news-card" style={{ height: '250px' }}></div>
                        <div className="skeleton-news-card" style={{ height: '250px' }}></div>
                    </div>
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

            <SummaryCards 
                lastDayNetFlow={lastDayNetFlow} 
                totalNetAssets={totalNetAssets} 
                marketCapPercentage={marketCapPercentage} 
                formatCurrency={formatCurrency} 
            />

            <div className="main-content">
                <FlowChart 
                    chartData={chartData}
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    positiveColor={positiveColor}
                    negativeColor={negativeColor}
                    formatCurrency={formatCurrency}
                />
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

            <NewsFeed />
        </div>
    );

};

export default Dashboard;