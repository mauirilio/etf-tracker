import requests
import json
from datetime import datetime

# --- CONFIGURAÇÃO ---
# Sua chave da API SoSoValue.
API_KEY = "SOSO-84769a0c26cf4274a7daa7837b010750"

# --- CONSTANTES DA API (Versão .xyz - A mais recente e funcional) ---
BASE_URL = "https://api.sosovalue.xyz/openapi/v2"
HEADERS = {
    "Content-Type": "application/json",
    "x-soso-api-key": API_KEY 
}

def check_api_key():
    """Verifica se a chave da API foi inserida."""
    if not API_KEY or "COLE_SUA_CHAVE" in API_KEY:
        print("ERRO: Chave da API não configurada.")
        return False
    return True

def get_etf_data(asset_type: str):
    """Busca os dados atuais e métricas para um tipo de ativo (BTC ou ETH)."""
    try:
        url = f"{BASE_URL}/etf/currentEtfDataMetrics"
        payload = {"type": f"us-{asset_type.lower()}-spot"}
        response = requests.post(url, headers=HEADERS, json=payload)
        response.raise_for_status()
        
        data = response.json()
        if data.get("code") == 0:
            return data.get("data", {}).get("list", [])
        else:
            error_msg = data.get('message') or data.get('msg') or json.dumps(data)
            print(f"Erro da API ao buscar dados para {asset_type.upper()}: {error_msg}")
            return []
            
    except requests.exceptions.RequestException as e:
        if e.response:
            print(f"Erro HTTP {e.response.status_code} ao buscar dados para {asset_type.upper()}: {e.response.text}")
        else:
            print(f"Erro de conexão ao buscar dados para {asset_type.upper()}: {e}")
        return []

def display_etf_data(etf_list, asset_type):
    """Exibe os dados de uma lista de ETFs de forma organizada."""
    if not etf_list:
        print(f"Nenhum dado encontrado para ETFs de {asset_type.upper()}.")
        return

    print("\n" + "="*25 + f" ETFs de {asset_type.upper()} " + "="*25)

    etf_list.sort(key=lambda x: float(x.get('netAssets', {}).get('value', 0)), reverse=True)

    for etf in etf_list:
        ticker = etf.get('ticker', 'N/A')
        institute = etf.get('institute', 'N/A')
        
        # CORREÇÃO FINAL: Usando os campos de valor em USD fornecidos pela API
        update_date_str = etf.get('netAssets', {}).get('lastUpdateDate', 'N/A')
        
        inflow_usd = float(etf.get('dailyNetInflow', {}).get('value', 0))
        total_holding_usd = float(etf.get('netAssets', {}).get('value', 0))

        print("-" * 70)
        print(f"Instituição: {institute:<20} Ticker: {ticker:<10}")
        print(f"  Data da Atualização: {update_date_str}")
        print("-" * 70)

        flow_str = f"${inflow_usd:,.2f} USD"
        if inflow_usd > 0:
            flow_str = f"  Fluxo do Dia: +{flow_str} (Entrada)"
        elif inflow_usd < 0:
            flow_str = f"  Fluxo do Dia: {flow_str} (Saída)"
        else:
            flow_str = f"  Fluxo do Dia:  {flow_str} (Sem alteração)"
            
        print(flow_str)
        print(f"  Total em Carteira: ${total_holding_usd:,.2f} USD")
        print("\n")

def main():
    """Função principal da aplicação."""
    if not check_api_key():
        return

    print("Buscando dados para ETFs de Bitcoin...")
    btc_etfs = get_etf_data("btc")
    display_etf_data(btc_etfs, "Bitcoin")

    print("Buscando dados para ETFs de Ethereum...")
    eth_etfs = get_etf_data("eth")
    display_etf_data(eth_etfs, "Ethereum")

if __name__ == "__main__":
    main()
