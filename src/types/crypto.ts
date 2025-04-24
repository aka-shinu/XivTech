export interface CryptoAsset {
  id: number;
  name: string;
  symbol: string;
  logo: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  maxSupply: number | null;
  chartData: number[];
}

export interface CryptoState {
  assets: CryptoAsset[];
  loading: boolean;
  error: string | null;
} 