// Mapeamento para corrigir nomes de ETFs que podem estar desatualizados na API
export const ETF_NAME_MAPPING: Record<string, string> = {
    // BRRR mudou de nome recentemente
    'BRRR': 'CoinShares Bitcoin ETF',
    // Adicione outros mapeamentos conforme necessário
};

/**
 * Corrige o nome do instituto do ETF se houver um mapeamento disponível
 * @param ticker - O ticker do ETF
 * @param originalInstitute - O nome original retornado pela API
 * @returns O nome correto do instituto
 */
export const getCorrectEtfName = (ticker: string, originalInstitute: string): string => {
    return ETF_NAME_MAPPING[ticker] || originalInstitute;
};