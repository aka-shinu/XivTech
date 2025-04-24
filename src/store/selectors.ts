import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const selectAssets = (state: RootState) => state.crypto.assets;

export const selectAssetById = createSelector(
  [selectAssets, (_state: RootState, id: number) => id],
  (assets, id) => assets.find(asset => asset.id === id)
);

export const selectAssetsForTable = createSelector(
  [selectAssets],
  (assets) => assets.map(asset => ({
    id: asset.id,
    name: asset.name,
    symbol: asset.symbol,
    logo: asset.logo,
    price: asset.price,
    change1h: asset.change1h,
    change24h: asset.change24h,
    change7d: asset.change7d,
    marketCap: asset.marketCap,
    volume24h: asset.volume24h,
    circulatingSupply: asset.circulatingSupply,
    maxSupply: asset.maxSupply,
    chartData: asset.chartData,
  }))
); 