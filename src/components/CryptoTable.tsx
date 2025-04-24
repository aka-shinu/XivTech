import React, { useState, useMemo } from 'react';
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { updatePrices } from "../store/cryptoSlice";
import { BinanceWebSocket } from "../services/BinanceWebSocket";
import { MiniChart } from './MiniChart';
import { selectAssetsForTable } from '../store/selectors';
import { FilterControls, SortField, SortDirection, FilterType } from './FilterControls';
import { formatPrice, formatPercent, formatMarketCap, formatVolume } from '../utils/formatters';

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  min-width: 1100px;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #666;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CoinImage = styled.img`
  width: 24px;
  height: 24px;
`;

const ChangeValue = styled.span<{ value: number }>`
  color: ${props => props.value > 0 ? '#16c784' : props.value < 0 ? '#ea3943' : '#333'};
`;

const Logo = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
`;

const NameCell = styled.div`
  display: flex;
  align-items: center;
`;

const Symbol = styled.span`
  color: #808a9d;
  margin-left: 8px;
`;

const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(num);
};

const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return formatCurrency(num);
};

const formatSupply = (supply: number | null): string => {
  if (supply === null) return 'No max supply';
  if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B`;
  if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M`;
  return formatNumber(supply);
};

export const CryptoTable = () => {
  const dispatch = useDispatch();
  const assets = useSelector(selectAssetsForTable);
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterType, setFilterType] = useState<FilterType>('all');

  useEffect(() => {
    const ws = new BinanceWebSocket((updates) => {
      dispatch(updatePrices(updates));
    });
    ws.connect();
    return () => ws.disconnect();
  }, [dispatch]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...assets];

    // Apply filter
    if (filterType === 'gainers') {
      filtered = filtered.filter(coin => coin.change24h > 0);
    } else if (filterType === 'losers') {
      filtered = filtered.filter(coin => coin.change24h < 0);
    }

    // Apply sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;

      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });

    return filtered;
  }, [assets, sortField, sortDirection, filterType]);

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleFilterChange = (filter: FilterType) => {
    setFilterType(filter);
  };

  return (
    <>
      <FilterControls
        sortField={sortField}
        sortDirection={sortDirection}
        filterType={filterType}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Price</Th>
              <Th>1h %</Th>
              <Th>24h %</Th>
              <Th>7d %</Th>
              <Th>Market Cap</Th>
              <Th>Volume(24h)</Th>
              <Th>Circulating Supply</Th>
              <Th>Max Supply</Th>
              <Th>Last 7 Days</Th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((asset) => (
              <tr key={asset.id}>
                <Td>{asset.id}</Td>
                <Td>
                  <CoinInfo>
                    {/* <CoinImage src={asset.logo} alt={asset.name} /> */}
                    <div>
                      <div>
                        <NameCell>
                          <Logo src={asset.logo} alt={asset.name} />
                          {asset.name}
                          <Symbol>{asset.symbol}</Symbol>
                        </NameCell>
                      </div>
                    </div>
                  </CoinInfo>
                </Td>
                <Td>{formatCurrency(asset.price)}</Td>
                <Td>
                  <ChangeValue value={asset.change1h}>
                    {formatPercent(asset.change1h)}
                  </ChangeValue>
                </Td>
                <Td>
                  <ChangeValue value={asset.change24h}>
                    {formatPercent(asset.change24h)}
                  </ChangeValue>
                </Td>
                <Td>
                  <ChangeValue value={asset.change7d}>
                    {formatPercent(asset.change7d)}
                  </ChangeValue>
                </Td>
                <Td>{formatMarketCap(asset.marketCap)}</Td>
                <Td>{formatVolume(asset.volume24h)}</Td>
                <Td>
                  {formatNumber(asset.circulatingSupply)}M {asset.symbol}
                </Td>
                <Td>
                  {formatSupply(asset.maxSupply)}
                </Td>
                <Td>
                  <MiniChart 
                    data={asset.chartData} 
                    color={asset.change7d >= 0 ? '#16c784' : '#ea3943'} 
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </>
  );
};
