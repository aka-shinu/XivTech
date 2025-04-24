import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { updatePrices } from "../store/cryptoSlice";
import { WebSocketSimulator } from "../services/WebSocketSimulator";
import { MiniChart } from './MiniChart';
import { selectAssetsForTable } from '../store/selectors';

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
  padding: 12px;
  text-align: left;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
  white-space: nowrap;
`;

const CryptoRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const ChangeValue = styled.span<{ isPositive: boolean }>`
  color: ${(props) => (props.isPositive ? "#16c784" : "#ea3943")};
  display: inline-flex;
  align-items: center;
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

  useEffect(() => {
    const ws = new WebSocketSimulator((updates) => {
      dispatch(updatePrices(updates));
    });
    ws.connect();
    return () => ws.disconnect();
  }, [dispatch]);

  return (
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
          {assets.map((asset) => (
            <CryptoRow key={asset.id}>
              <Td>{asset.id}</Td>
              <Td>
                <NameCell>
                  <Logo src={asset.logo} alt={asset.name} />
                  {asset.name}
                  <Symbol>{asset.symbol}</Symbol>
                </NameCell>
              </Td>
              <Td>{formatCurrency(asset.price)}</Td>
              <Td>
                <ChangeValue isPositive={asset.change1h >= 0}>
                  {asset.change1h > 0 ? "↑" : "↓"} {Math.abs(asset.change1h)}%
                </ChangeValue>
              </Td>
              <Td>
                <ChangeValue isPositive={asset.change24h >= 0}>
                  {asset.change24h > 0 ? "↑" : "↓"} {Math.abs(asset.change24h)}%
                </ChangeValue>
              </Td>
              <Td>
                <ChangeValue isPositive={asset.change7d >= 0}>
                  {asset.change7d > 0 ? "↑" : "↓"} {Math.abs(asset.change7d)}%
                </ChangeValue>
              </Td>
              <Td>{formatLargeNumber(asset.marketCap)}</Td>
              <Td>{formatLargeNumber(asset.volume24h)}</Td>
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
            </CryptoRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};
