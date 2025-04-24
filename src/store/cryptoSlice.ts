import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CryptoState, CryptoAsset } from '../types/crypto';

// Generate more realistic looking chart data
const generateChartData = (trend: 'up' | 'down' | 'stable' = 'up', volatility = 0.05) => {
  const points = 50;
  const data = [];
  let currentValue = 100;

  for (let i = 0; i < points; i++) {
    // Add random volatility
    const change = (Math.random() - 0.5) * volatility * currentValue;
    // Add trend
    const trendChange = trend === 'up' ? 0.4 : trend === 'down' ? -0.4 : 0;
    currentValue += change + trendChange;
    data.push(Math.max(currentValue, 50)); // Ensure value doesn't go too low
  }
  return data;
};

const initialState: CryptoState = {
  assets: [
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      logo: "/bitcoin.svg",
      price: 93759.48,
      change1h: 0.43,
      change24h: 0.93,
      change7d: 11.11,
      marketCap: 1861618902186,
      volume24h: 43874950947,
      circulatingSupply: 19.85,
      maxSupply: 21,
      chartData: generateChartData('up', 0.03)
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETH",
      logo: "/ethereum.svg",
      price: 1802.46,
      change1h: 0.60,
      change24h: 3.21,
      change7d: 13.68,
      marketCap: 217581279327,
      volume24h: 23547469307,
      circulatingSupply: 120.71,
      maxSupply: null,
      chartData: generateChartData('up', 0.04)
    },
    {
      id: 3,
      name: "Tether",
      symbol: "USDT",
      logo: "/tether.svg",
      price: 1.00,
      change1h: 0.00,
      change24h: 0.00,
      change7d: 0.04,
      marketCap: 145320022085,
      volume24h: 92288882007,
      circulatingSupply: 145.27,
      maxSupply: 100000,
      chartData: generateChartData('stable', 0.001)
    },
    {
      id: 4,
      name: "XRP",
      symbol: "XRP",
      logo: "/xrp.svg",
      price: 2.22,
      change1h: 0.46,
      change24h: 0.54,
      change7d: 6.18,
      marketCap: 130073814966,
      volume24h: 5131481491,
      circulatingSupply: 58.39,
      maxSupply: 100,
      chartData: generateChartData('up', 0.05)
    },
    {
      id: 5,
      name: "BNB",
      symbol: "BNB",
      logo: "/bnb.svg",
      price: 606.65,
      change1h: 0.09,
      change24h: -1.20,
      change7d: 3.73,
      marketCap: 85471956947,
      volume24h: 1874281784,
      circulatingSupply: 140.89,
      maxSupply: 200,
      chartData: generateChartData('up', 0.04)
    }
  ],
  loading: false,
  error: null
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateAsset(state, action: PayloadAction<Partial<CryptoAsset> & { id: number }>) {
      const index = state.assets.findIndex(asset => asset.id === action.payload.id);
      if (index !== -1) {
        state.assets[index] = { ...state.assets[index], ...action.payload };
      }
    },
    updatePrices(state, action: PayloadAction<{ id: number; price: number; change1h: number; change24h: number; volume24h: number }[]>) {
      action.payload.forEach(update => {
        const asset = state.assets.find(a => a.id === update.id);
        if (asset) {
          Object.assign(asset, update);
          // Update last point in chart data
          if (asset.chartData.length > 0) {
            const newPoint = asset.chartData[asset.chartData.length - 1] * (1 + (Math.random() - 0.5) * 0.02);
            asset.chartData = [...asset.chartData.slice(1), newPoint];
          }
        }
      });
    }
  }
});

export const { updateAsset, updatePrices } = cryptoSlice.actions;
export default cryptoSlice.reducer; 