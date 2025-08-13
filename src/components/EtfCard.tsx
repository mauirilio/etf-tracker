import React from 'react';
import { Card } from 'react-bootstrap';
import type { EtfData } from '../types/etfTypes';
import { formatDateSafely } from '../utils/dateUtils';
import { getEtfIcon } from '../utils/etfIcons';

interface EtfCardProps {
    etf: EtfData;
}

const EtfCard: React.FC<EtfCardProps> = ({ etf }) => {
    // Formata os valores para o padrão brasileiro
    const formatCurrency = (value: string) => {
        const number = parseFloat(value.replace(/,/g, ''));
        if (isNaN(number)) {
            return value; // Retorna o valor original se não for um número
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'USD', // ou a moeda que a API retorna, BRL, etc.
        }).format(number);
    };

    const formatDate = (dateString: string) => {
        return formatDateSafely(dateString);
    };

    return (
        <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
                <Card.Title className="font-weight-bold">{etf.institute}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted d-flex align-items-center gap-2">
                    {getEtfIcon(etf.ticker)}
                    <span>{etf.ticker}</span>
                </Card.Subtitle>
                <div className="mt-auto">
                    <Card.Text className="mb-1">
                        <strong>Fluxo Líquido Diário:</strong> {formatCurrency(etf.dailyNetInflow.value)}
                    </Card.Text>
                    <Card.Text>
                        <strong>Ativos Líquidos:</strong> {formatCurrency(etf.netAssets.value)}
                    </Card.Text>
                    <small className="text-muted">
                        Última atualização: {formatDate(etf.netAssets.lastUpdateDate)}
                    </small>
                </div>
            </Card.Body>
        </Card>
    );
};

export default EtfCard;
