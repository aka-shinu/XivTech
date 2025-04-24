import styled from 'styled-components';

interface MiniChartProps {
  data: number[];
  color: string;
}

const ChartContainer = styled.div`
  width: 160px;
  height: 60px;
  display: inline-block;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

export const MiniChart = ({ data, color }: MiniChartProps) => {
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue;
  
  // Create smooth curve points
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 160;
    const y = 60 - ((value - minValue) / range) * 50; // Leave some padding
    return `${x},${y}`;
  }).join(' ');

  // Create path for gradient fill
  const fillPath = `M0,60 ${points} 160,60`;

  return (
    <ChartContainer>
      <ChartSvg viewBox="0 0 160 60">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Gradient fill area */}
        <path
          d={fillPath}
          fill={`url(#gradient-${color})`}
        />
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </ChartSvg>
    </ChartContainer>
  );
}; 