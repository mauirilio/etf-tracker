# ETF Tracker Dashboard

Este é um painel de controle desenvolvido em React, TypeScript e Vite para monitorar o fluxo de entrada e saída de ETFs (Exchange Traded Funds) de Bitcoin e Ethereum. A aplicação consome dados da API da sosovalue e da CoinGecko para exibir informações atualizadas em tempo real.

## Funcionalidades

- **Visualização de Dados em Tempo Real:** Acompanhe o fluxo líquido diário, o total de ativos líquidos e o fluxo total desde o início para os principais ETFs.
- **Gráficos Interativos:** Analise o histórico de fluxo líquido através de gráficos de barras com diferentes períodos de tempo (semanal, mensal, anual).
- **Comparação de Ativos:** Alterne facilmente entre a visualização de dados para ETFs de Bitcoin e Ethereum.
- **Feed de Notícias Relevantes:** Acesse um feed de notícias curado com as informações mais importantes sobre o mercado de ETFs de criptomoedas, focando em Bitcoin, Ethereum, e anúncios da SEC.
- **Cálculo de Dominância de Mercado:** Veja a porcentagem que os ativos líquidos totais dos ETFs representam em relação à capitalização de mercado total do Bitcoin ou Ethereum.
- **Interface Responsiva e Moderna:** Desenvolvido com uma interface limpa e amigável, utilizando componentes React e estilização com CSS.

## Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Vite
- **Estilização:** CSS Modules
- **Gráficos:** Recharts
- **Requisições HTTP:** Axios
- **APIs:**
    - [sosovalue](https://sosovalue.xyz/) para dados de fluxo de ETFs.
    - [CoinGecko](https://www.coingecko.com/en/api) para dados de capitalização de mercado de criptomoedas.

## Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd etf-tracker-dashboard
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta, se a 5173 estiver em uso).

## Estrutura do Projeto

```
src/
├── components/    # Componentes reutilizáveis (Cards, Gráficos, Skeletons)
├── pages/         # Páginas da aplicação (Dashboard)
├── services/      # Lógica de chamada de API (apiService.ts)
├── types/         # Definições de tipos TypeScript (etfTypes.ts)
├── App.tsx        # Componente principal da aplicação
└── main.tsx       # Ponto de entrada da aplicação
```
