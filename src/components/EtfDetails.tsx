import React from 'react';
import { FiX, FiTrendingUp, FiTrendingDown, FiDollarSign, FiCalendar } from 'react-icons/fi';
import type { EtfData } from '../types/etfTypes';
import { formatDateSafely } from '../utils/dateUtils';
import { getEtfIcon } from '../utils/etfIcons';

interface EtfDetailsProps {
    etf: EtfData;
    isOpen: boolean;
    onClose: () => void;
    formatCurrency: (value: string | number) => string;
}

const EtfDetails: React.FC<EtfDetailsProps> = ({ etf, isOpen, onClose, formatCurrency }) => {
    if (!isOpen) return null;

    const flowValue = parseFloat(etf.dailyNetInflow.value);
    const isPositiveFlow = flowValue >= 0;

    return (
        <div className="etf-details-overlay" onClick={onClose}>
            <div className="etf-details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="etf-details-header">
                    <div className="etf-details-title">
                        <div className="etf-title-with-icon">
                            {getEtfIcon(etf.ticker)}
                            <h2>{etf.ticker}</h2>
                        </div>
                        <span className="etf-institute">{etf.institute}</span>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        <FiX size={24} />
                    </button>
                </div>
                
                <div className="etf-details-content">
                    <div className="detail-card">
                        <div className="detail-icon">
                            {isPositiveFlow ? (
                                <FiTrendingUp className="positive-icon" size={24} />
                            ) : (
                                <FiTrendingDown className="negative-icon" size={24} />
                            )}
                        </div>
                        <div className="detail-info">
                            <h3>Fluxo Líquido Diário</h3>
                            <p className={`detail-value ${isPositiveFlow ? 'positive-flow' : 'negative-flow'}`}>
                                {formatCurrency(etf.dailyNetInflow.value)}
                            </p>
                            <span className="detail-description">
                                {isPositiveFlow ? 'Entrada de capital' : 'Saída de capital'}
                            </span>
                        </div>
                    </div>

                    <div className="detail-card">
                        <div className="detail-icon">
                            <FiDollarSign className="neutral-icon" size={24} />
                        </div>
                        <div className="detail-info">
                            <h3>Patrimônio Líquido</h3>
                            <p className="detail-value">
                                {formatCurrency(etf.netAssets.value)}
                            </p>
                            <span className="detail-description">
                                Total de ativos sob gestão
                            </span>
                        </div>
                    </div>

                    <div className="detail-card">
                        <div className="detail-icon">
                            <FiCalendar className="neutral-icon" size={24} />
                        </div>
                        <div className="detail-info">
                            <h3>Última Atualização</h3>
                            <p className="detail-value">
                                {formatDateSafely(etf.netAssets.lastUpdateDate)}
                            </p>
                            <span className="detail-description">
                                Data da última atualização dos dados
                            </span>
                        </div>
                    </div>

                    <div className="detail-summary">
                        <h3>Resumo</h3>
                        <p>
                            O ETF {etf.ticker} da {etf.institute} possui um patrimônio líquido de {formatCurrency(etf.netAssets.value)} 
                            e registrou um fluxo líquido diário de {formatCurrency(etf.dailyNetInflow.value)}.
                            {flowValue > 0 
                                ? ' Este fluxo positivo indica entrada de capital no fundo.' 
                                : flowValue < 0 
                                ? ' Este fluxo negativo indica saída de capital do fundo.'
                                : ' Não houve fluxo líquido significativo no período.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EtfDetails;