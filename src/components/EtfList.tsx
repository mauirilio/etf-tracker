import React from 'react';
import type { EtfData } from '../types/etfTypes';
import { getEtfIcon } from '../utils/etfIcons';

interface EtfListProps {
    etfs: EtfData[];
    formatCurrency: (value: string | number) => string;
    onEtfClick: (etf: EtfData) => void;
}

const EtfList: React.FC<EtfListProps> = ({ etfs, formatCurrency, onEtfClick }) => {
    // Ordena os ETFs pelo maior fluxo líquido diário
    const sortedEtfs = [...etfs].sort((a, b) => parseFloat(String(b.dailyNetInflow.value)) - parseFloat(String(a.dailyNetInflow.value)));

    // Define as cores para o ponto
    const dotColor = (value: string | number) => parseFloat(String(value)) >= 0 ? 'var(--positive-flow)' : 'var(--negative-flow)';

    return (
        <div className="etf-flow-card card">
            <h3>Fluxo por ETF</h3>
            <div className="etf-list">
                {sortedEtfs.map((etf, index) => (
                    <div 
                        key={index} 
                        className="etf-list-item clickable" 
                        onClick={() => onEtfClick(etf)}
                        title={`Clique para ver detalhes de ${etf.ticker}`}
                    >
                        <div className="etf-info">
                            <span className="color-dot" style={{ backgroundColor: dotColor(etf.dailyNetInflow.value) }}></span>
                            <div className="etf-ticker-container">
                                {getEtfIcon(etf.ticker)}
                                <span>{etf.ticker}</span>
                            </div>
                        </div>
                        <span className={`etf-flow-value ${parseFloat(String(etf.dailyNetInflow.value)) >= 0 ? 'positive-flow' : 'negative-flow'}`}>
                            {formatCurrency(etf.dailyNetInflow.value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EtfList;