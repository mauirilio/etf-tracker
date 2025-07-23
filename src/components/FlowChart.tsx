import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DatePicker from 'react-datepicker';

interface ChartData {
    date: string;
    flow: number;
}

interface FlowChartProps {
    chartData: ChartData[];
    timeRange: string;
    setTimeRange: (range: 'Diário' | 'Semanal' | 'Mensal' | 'Personalizado') => void;
    dateRange: [Date | null, Date | null];
    setDateRange: (range: [Date | null, Date | null]) => void;
    positiveColor: string;
    negativeColor: string;
    formatCurrency: (value: string | number) => string;
}

const FlowChart: React.FC<FlowChartProps> = ({ 
    chartData, 
    timeRange, 
    setTimeRange, 
    dateRange, 
    setDateRange, 
    positiveColor, 
    negativeColor, 
    formatCurrency 
}) => {
    const [startDate, endDate] = dateRange;

    return (
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
                            setDateRange(update as [Date | null, Date | null]);
                            if (update && update[0] && update[1]) {
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
    );
};

export default FlowChart;