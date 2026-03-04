import type { Coin, CoinDetail, ChartDataPoint } from '@/types/coin';

const BASE_URL = 'https://api.coingecko.com/api/v3';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);
  return res.json();
}

export async function fetchCoins(page = 1, perPage = 50): Promise<Coin[]> {
  return fetchJson<Coin[]>(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`
  );
}

export async function fetchCoinDetail(id: string): Promise<CoinDetail> {
  return fetchJson<CoinDetail>(
    `${BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
  );
}

export async function fetchChartData(id: string, days: string): Promise<ChartDataPoint[]> {
  const data = await fetchJson<{ prices: [number, number][] }>(
    `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
  return data.prices.map(([timestamp, price]) => ({ timestamp, price }));
}
