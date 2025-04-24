import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CryptoState, CryptoAsset, CryptoUpdate } from '../types/crypto';

// Generate more realistic looking chart data
const generateChartData = (trend: 'up' | 'down' | 'stable' = 'up', volatility = 0.05) => {
  const points = 50;
  const data = [];
  let currentValue = 100;

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * volatility * currentValue;
    const trendChange = trend === 'up' ? 0.4 : trend === 'down' ? -0.4 : 0;
    currentValue += change + trendChange;
    data.push(Math.max(currentValue, 50));
  }
  return data;
};

const initialState: CryptoState = {
  assets: [
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      price: 50000.00,
      change1h: 0,
      change24h: 0,
      change7d: 2.5,
      marketCap: 928379283928,
      volume24h: 28937928379,
      circulatingSupply: 19.5,
      maxSupply: 21,
      chartData: Array(50).fill(50000.00),
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETH",
      logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      price: 3000.00,
      change1h: 0,
      change24h: 0,
      change7d: 3.2,
      marketCap: 382937928379,
      volume24h: 19283792837,
      circulatingSupply: 120.5,
      maxSupply: null,
      chartData: Array(50).fill(3000.00),
    },
    {
      id: 3,
      name: "BNB",
      symbol: "BNB",
      logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
      price: 400.00,
      change1h: 0,
      change24h: 0,
      change7d: 1.8,
      marketCap: 82937928379,
      volume24h: 5283792837,
      circulatingSupply: 180.5,
      maxSupply: 200,
      chartData: Array(50).fill(400.00),
    },
    {
      id: 4,
      name: "XRP",
      symbol: "XRP",
      logo: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
      price: 0.50,
      change1h: 0,
      change24h: 0,
      change7d: -1.2,
      marketCap: 28937928379,
      volume24h: 2283792837,
      circulatingSupply: 45000,
      maxSupply: 100000,
      chartData: Array(50).fill(0.50),
    },
    {
      id: 5,
      name: "Solana",
      symbol: "SOL",
      logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
      price: 100.00,
      change1h: 0,
      change24h: 0,
      change7d: 5.4,
      marketCap: 38937928379,
      volume24h: 3283792837,
      circulatingSupply: 350,
      maxSupply: null,
      chartData: Array(50).fill(100.00),
    },
  ]
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updatePrices(state, action: PayloadAction<CryptoUpdate[]>) {
      action.payload.forEach(update => {
        const asset = state.assets.find(a => a.id === update.id);
        if (asset) {
          asset.price = update.price;
          asset.change1h = update.change1h;
          asset.change24h = update.change24h;
          asset.volume24h = update.volume24h;
          asset.chartData = update.chartData;
          // Update market cap based on new price
          asset.marketCap = asset.price * asset.circulatingSupply * 1000000; // Convert to millions
        }
      });
    },
  },
});

export const { updatePrices } = cryptoSlice.actions;
export default cryptoSlice.reducer; 