# Crypto Price Tracker

Hey there! 👋 This is my implementation of a cryptocurrency price tracker built with React and Redux Toolkit. It was created as part of an assignment to demonstrate real-time data handling and state management.

## What's Inside?

I've built a responsive table that displays 5 major cryptocurrencies (BTC, ETH, USDT, XRP, and BNB) with their key metrics. The app simulates real-time price updates to give you that live trading feel, even though we're working with mock data.

### Key Features I Implemented:

- 🎨 A clean, responsive table layout that works well on different screen sizes
- 🔄 Simulated real-time updates using a custom WebSocket simulator class
- 📊 Basic chart visualization for 7-day price trends
- 🎯 Color-coded percentage changes (green for gains, red for losses)
- 💾 All state managed through Redux Toolkit

## Tech Stack

I used:
- React 18 for the UI
- TypeScript for type safety
- Redux Toolkit for state management
- Styled Components for styling
- Vite for the build tool

## How It Works

### The Table
I've implemented a table that shows:
- Basic info (logo, name, symbol)
- Current price
- Percentage changes (1h, 24h, 7d)
- Market data (cap, volume, supply)
- A simple chart showing price trends

### The Magic Behind Updates
Instead of using a real WebSocket connection, I created a `WebSocketSimulator` class that:
- Uses `setInterval` to update prices every 2 seconds
- Generates random price changes within realistic ranges
- Updates the Redux store with new values

### State Management
I used Redux Toolkit to:
- Store all crypto asset data
- Handle price updates through actions
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

Here's how I organized the code:
- `/src/components` - React components (like the CryptoTable)
- `/src/store` - Redux store setup and slices
- `/src/services` - The WebSocket simulator
- `/src/types` - TypeScript interfaces

## A Quick Note

This is a learning project, so the price changes are randomly generated and don't reflect real market data. I focused on implementing the core requirements of the assignment while keeping the code clean and maintainable.

Feel free to explore the code and let me know if you have any questions! 😊 