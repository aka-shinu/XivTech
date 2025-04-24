import { CryptoUpdate } from '../types/crypto';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/stream';
const UPDATE_INTERVAL = 2000; // 2 seconds
const CHART_DATA_POINTS = 50;

interface BinanceTicker {
  e: string;        // Event type
  E: number;        // Event time
  s: string;        // Symbol
  p: string;        // Price change
  P: string;        // Price change percent
  w: string;        // Weighted average price
  c: string;        // Last price
  Q: string;        // Last quantity
  o: string;        // Open price
  h: string;        // High price
  l: string;        // Low price
  v: string;        // Total trading volume
  q: string;        // Total trading quote asset volume
  O: number;        // Statistics open time
  C: number;        // Statistics close time
  F: number;        // First trade ID
  L: number;        // Last trade Id
  n: number;        // Total number of trades
}

export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private symbolMap: { [key: string]: number } = {
    'BTCUSDT': 1,
    'ETHUSDT': 2,
    'BNBUSDT': 3,
    'XRPUSDT': 4,
    'SOLUSDT': 5,
  };
  private lastPrices: { [key: string]: number } = {};
  private lastUpdates: { [key: string]: CryptoUpdate } = {};
  private chartData: { [key: string]: number[] } = {};
  private callback: (updates: CryptoUpdate[]) => void;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(callback: (updates: CryptoUpdate[]) => void) {
    this.callback = callback;
    this.initializeChartData();
  }

  private initializeChartData() {
    Object.keys(this.symbolMap).forEach(symbol => {
      const initialPrice = this.getInitialPrice(symbol);
      this.chartData[symbol] = Array(CHART_DATA_POINTS).fill(0).map((_, i) => {
        const variation = (Math.random() - 0.5) * 0.02 * initialPrice;
        return initialPrice + variation;
      });
      
      // Initialize last updates
      this.lastUpdates[symbol] = {
        id: this.symbolMap[symbol],
        price: initialPrice,
        change1h: 0,
        change24h: 0,
        volume24h: 0,
        chartData: this.chartData[symbol],
        marketCap: initialPrice * this.getCirculatingSupply(symbol)
      };
    });
  }

  private getInitialPrice(symbol: string): number {
    const initialPrices: { [key: string]: number } = {
      'BTCUSDT': 50000,
      'ETHUSDT': 3000,
      'BNBUSDT': 400,
      'XRPUSDT': 0.5,
      'SOLUSDT': 100
    };
    return initialPrices[symbol] || 0;
  }

  private updateChartData(symbol: string, price: number) {
    if (!this.chartData[symbol]) {
      this.chartData[symbol] = Array(CHART_DATA_POINTS).fill(price);
    }
    this.chartData[symbol] = [...this.chartData[symbol].slice(1), price];
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    const symbols = Object.keys(this.symbolMap);
    const streams = symbols.map(symbol => `${symbol.toLowerCase()}@ticker`);
    
    try {
      const subscribeMessage = {
        method: "SUBSCRIBE",
        params: streams,
        id: 1
      };

      this.ws = new WebSocket(BINANCE_WS_URL);

      this.ws.onopen = () => {
        console.log('Connected to Binance WebSocket');
        if (this.ws) {
          this.ws.send(JSON.stringify(subscribeMessage));
        }
        this.reconnectAttempts = 0;
        this.startUpdateInterval();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Skip subscription responses
          if (data.result === null) return;
          
          const ticker = data.data;
          if (!ticker || !ticker.s) return;

          const symbol = ticker.s; // Symbol (e.g., 'BTCUSDT')
          const currentPrice = parseFloat(ticker.c); // Last price
          const priceChange1h = parseFloat(ticker.P); // Price change percent 24h
          const priceChange24h = parseFloat(ticker.p); // Price change
          const volume24h = parseFloat(ticker.q); // Quote asset volume (USDT volume)

          // Store the last price for chart updates
          this.lastPrices[symbol] = currentPrice;
          this.updateChartData(symbol, currentPrice);

          // Calculate the market cap (price * circulating supply)
          const circulatingSupply = this.getCirculatingSupply(symbol);
          const marketCap = currentPrice * circulatingSupply;

          const update: CryptoUpdate = {
            id: this.symbolMap[symbol],
            price: currentPrice,
            change1h: priceChange1h,
            change24h: priceChange24h,
            volume24h: volume24h,
            chartData: this.chartData[symbol],
            marketCap: marketCap
          };

          // Store the last update
          this.lastUpdates[symbol] = update;
          
          this.callback([update]);
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.handleReconnect();
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.stopUpdateInterval();
        this.handleReconnect();
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.handleReconnect();
    }
  }

  private getCirculatingSupply(symbol: string): number {
    // Approximate circulating supply values (in millions)
    const supply: { [key: string]: number } = {
      'BTCUSDT': 19.5,
      'ETHUSDT': 120.5,
      'BNBUSDT': 180.5,
      'XRPUSDT': 45000,
      'SOLUSDT': 350
    };
    return supply[symbol] || 0;
  }

  private startUpdateInterval() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(() => {
      Object.entries(this.lastUpdates).forEach(([symbol, lastUpdate]) => {
        if (lastUpdate.price > 0) {
          // Add small random variation for visual smoothness between updates
          const variation = (Math.random() - 0.5) * 0.0001 * lastUpdate.price;
          const variedPrice = lastUpdate.price + variation;
          this.updateChartData(symbol, variedPrice);

          const update: CryptoUpdate = {
            ...lastUpdate,
            price: variedPrice,
            chartData: this.chartData[symbol],
            marketCap: variedPrice * this.getCirculatingSupply(symbol)
          };
          
          this.callback([update]);
        }
      });
    }, UPDATE_INTERVAL);
  }

  private stopUpdateInterval() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private handleReconnect() {
    this.stopUpdateInterval();
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    this.stopUpdateInterval();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
} 