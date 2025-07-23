import React from 'react';

interface SummaryCardsProps {
    lastDayNetFlow: number;
    totalNetAssets: number;
    marketCapPercentage: number;
    formatCurrency: (value: string | number) => string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ lastDayNetFlow, totalNetAssets, marketCapPercentage, formatCurrency }) => {
    return (
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
    );
};

export default SummaryCards;