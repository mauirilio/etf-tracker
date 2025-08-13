import React from 'react';

// Mapeamento de ícones SVG para cada ETF
export const ETF_ICONS: Record<string, React.ReactNode> = {
  // Bitcoin ETFs
  'IBIT': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#000000"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">IBIT</text>
    </svg>
  ),
  'FBTC': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#1E3A8A"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">FBTC</text>
    </svg>
  ),
  'BITB': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#F59E0B"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">BITB</text>
    </svg>
  ),
  'ARKB': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#7C3AED"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">ARKB</text>
    </svg>
  ),
  'BTCO': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#059669"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">BTCO</text>
    </svg>
  ),
  'EZBC': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#DC2626"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">EZBC</text>
    </svg>
  ),
  'BRRR': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#0891B2"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">BRRR</text>
    </svg>
  ),
  'HODL': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#7C2D12"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">HODL</text>
    </svg>
  ),
  'GBTC': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#374151"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">GBTC</text>
    </svg>
  ),
  'BTCW': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#1F2937"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">BTCW</text>
    </svg>
  ),
  
  // Ethereum ETFs
  'ETHE': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#627EEA"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">ETHE</text>
    </svg>
  ),
  'ETH': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#627EEA"/>
      <path d="M12 3L7 12L12 15L17 12L12 3Z" fill="white"/>
      <path d="M12 16L7 13L12 21L17 13L12 16Z" fill="white" opacity="0.6"/>
    </svg>
  ),
  'ETHW': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#3B82F6"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">ETHW</text>
    </svg>
  ),
  'FETH': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#1E40AF"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">FETH</text>
    </svg>
  ),
  'CETH': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#8B5CF6"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">CETH</text>
    </svg>
  ),
  'QETH': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#10B981"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">QETH</text>
    </svg>
  ),
  'EZET': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#EF4444"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">EZET</text>
    </svg>
  ),
  'ETHA': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#F97316"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">ETHA</text>
    </svg>
  ),
  'ETHV': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#06B6D4"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">ETHV</text>
    </svg>
  )
};

// Função para obter o ícone de um ETF
export const getEtfIcon = (ticker: string): React.ReactNode => {
  return ETF_ICONS[ticker.toUpperCase()] || (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#6B7280"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
        {ticker.substring(0, 4).toUpperCase()}
      </text>
    </svg>
  );
};

// Função para obter a cor do ícone de um ETF
export const getEtfIconColor = (ticker: string): string => {
  const colorMap: Record<string, string> = {
    'IBIT': '#000000',
    'FBTC': '#1E3A8A',
    'BITB': '#F59E0B',
    'ARKB': '#7C3AED',
    'BTCO': '#059669',
    'EZBC': '#DC2626',
    'BRRR': '#0891B2',
    'HODL': '#7C2D12',
    'GBTC': '#374151',
    'BTCW': '#1F2937',
    'ETHE': '#627EEA',
    'ETH': '#627EEA',
    'ETHW': '#3B82F6',
    'FETH': '#1E40AF',
    'CETH': '#8B5CF6',
    'QETH': '#10B981',
    'EZET': '#EF4444',
    'ETHA': '#F97316',
    'ETHV': '#06B6D4'
  };
  
  return colorMap[ticker.toUpperCase()] || '#6B7280';
};