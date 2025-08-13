/**
 * Utilitários para manipulação e validação de datas
 */

/**
 * Valida se uma data não está no futuro e corrige se necessário
 * @param dateString - String da data a ser validada
 * @returns String da data corrigida ou a data atual se estiver no futuro
 */
export const validateAndCorrectDate = (dateString: string): string => {
    const inputDate = new Date(dateString);
    const currentDate = new Date();
    
    // Se a data está no futuro, retorna a data atual
    if (inputDate > currentDate) {
        console.warn(`Data no futuro detectada: ${dateString}. Usando data atual.`);
        return currentDate.toISOString();
    }
    
    return dateString;
};

/**
 * Formata uma data para o padrão brasileiro com validação
 * @param dateString - String da data a ser formatada
 * @returns Data formatada em pt-BR
 */
export const formatDateSafely = (dateString: string): string => {
    const correctedDate = validateAndCorrectDate(dateString);
    return new Date(correctedDate).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        timeZone: 'UTC' 
    });
};