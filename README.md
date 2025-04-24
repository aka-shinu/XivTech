# Real-Time Crypto Price Tracker

Hey there! 👋 This is my implementation of a real-time cryptocurrency price tracker built with React, Redux Toolkit, and Binance WebSocket API. The application provides live price updates and interactive charts for major cryptocurrencies.

<div align='center'>
<span><a href='https://raw.githubusercontent.com//aka-shinu/XivTech/main/public/demo.mp4'>Video</a></span>
</div>&nbsp;

## What's Inside?

I've built a responsive table that displays 5 major cryptocurrencies (BTC, ETH, USDT, XRP, and BNB) with their key metrics. The app connects to Binance's WebSocket API to provide real-time price updates and market data.

### Key Features:

- 🎨 A clean, responsive table layout that works well on different screen sizes
- 🔄 Real-time price updates using Binance WebSocket API
- 📊 Interactive charts showing 7-day price trends
- 🎯 Color-coded percentage changes (green for gains, red for losses)
- 💾 State management with Redux Toolkit
- 🔍 Search functionality to filter cryptocurrencies
- 📱 Mobile-friendly design

## Tech Stack

- React 18 for the UI
- TypeScript for type safety
- Redux Toolkit for state management
- Styled Components for styling
- Vite for the build tool
- Binance WebSocket API for real-time data
- Recharts for interactive charts

## How It Works

### The Table
The application displays:
- Basic info (logo, name, symbol)
- Current price
- Percentage changes (1h, 24h, 7d)
- Market data (cap, volume, supply)
- Interactive charts showing 7-day price trends

### Real-Time Updates
The application:
- Connects to Binance's WebSocket API
- Subscribes to real-time price updates for selected cryptocurrencies
- Updates the UI automatically when new data arrives
- Handles WebSocket connection management and reconnection

### State Management
Redux Toolkit is used to:
- Store all crypto asset data
- Handle real-time price updates
- Manage search functionality
- Optimize re-renders with selectors

## Getting Started

1. Clone the repo and install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. To build for production:
```bash
npm run build
```

## Project Structure

- `/src/components` - React components (CryptoTable, SearchBar, etc.)
- `/src/store` - Redux store setup and slices
- `/src/services` - WebSocket connection and data handling
- `/src/types` - TypeScript interfaces
- `/src/utils` - Helper functions and constants
- `/src/hooks` - Custom React hooks

## Features in Development

- [ ] Historical price data for longer timeframes
- [ ] Additional technical indicators
- [ ] User preferences and watchlists
- [ ] More detailed market analysis

