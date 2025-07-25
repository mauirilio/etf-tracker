import React from 'react';
import type { EtfData } from '../types/etfTypes';

interface EtfListProps {
    etfs: EtfData[];
    formatCurrency: (value: string | number) => string;
}

const EtfList: React.FC<EtfListProps> = ({ etfs, formatCurrency }) => {
    // Ordena os ETFs pelo maior fluxo líquido diário
    const sortedEtfs = [...etfs].sort((a, b) => parseFloat(b.dailyNetInflow.value) - parseFloat(a.dailyNetInflow.value));

    // Define as cores para o ponto
    const dotColor = (value: string) => parseFloat(value) >= 0 ? 'var(--positive-flow)' : 'var(--negative-flow)';

    return (
        <div className="etf-flow-card card">
            <h3>Fluxo por ETF</h3>
            <div className="etf-list">
                {sortedEtfs.map((etf, index) => (
                    <div key={index} className="etf-list-item">
                        <div className="etf-info">
                            <span className="color-dot" style={{ backgroundColor: dotColor(etf.dailyNetInflow.value) }}></span>
                            <span>{etf.ticker}</span>
                        </div>
                        <span className={`etf-flow-value ${parseFloat(etf.dailyNetInflow.value) >= 0 ? 'positive-flow' : 'negative-flow'}`}>
    {formatCurrency(etf.dailyNetInflow.value)}
</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EtfList;