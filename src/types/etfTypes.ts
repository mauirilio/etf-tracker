export interface EtfData {
    ticker: string;
    institute: string;
    dailyNetInflow: {
        value: string;
    };
    netAssets: {
        value: string;
        lastUpdateDate: string;
    };
}

export interface EtfHistory {
    date: string;
    totalNetInflow: string;
    totalValueTraded: string;
}
