import styled from 'styled-components';

interface MiniChartProps {
  data: number[];
  color: string;
}

const ChartContainer = styled.div`
  width: 160px;
  height: 60px;
  display: inline-block;
  position: relative;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

export const MiniChart = ({ data, color }: MiniChartProps) => {
  // Filter out any invalid values and ensure we have data
  const validData = data.filter(value => !isNaN(value) && isFinite(value));
  
  // Return empty container if no valid data or single point
  if (validData.length <= 1) {
    return <ChartContainer />;
  }

  const minValue = Math.min(...validData);
  const maxValue = Math.max(...validData);
  
  // If all values are the same, create a straight line with padding
  if (minValue === maxValue) {
    const y = 30; // Center of the chart
    const points = validData.map((_, index) => {
      const x = (index / (validData.length - 1)) * 160;
      return [x, y];
    });
    
    const path = `M ${points[0][0]},${points[0][1]} L ${points[points.length - 1][0]},${points[points.length - 1][1]}`;
    const fillPath = `${path} L ${points[points.length - 1][0]},60 L ${points[0][0]},60 Z`;
    const gradientId = `gradient-${color.replace('#', '')}-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <ChartContainer>
        <ChartSvg viewBox="0 0 160 60">
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={fillPath} fill={`url(#${gradientId})`} strokeWidth="0" />
          <path d={path} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </ChartSvg>
      </ChartContainer>
    );
  }

  // Calculate range with adaptive padding
  const range = maxValue - minValue;
  const padding = range * 0.1; // 10% padding
  const paddedMin = Math.max(0, minValue - padding);
  const paddedMax = maxValue + padding;

  // Create points with proper scaling and ensure minimum visual difference
  const points = validData.map((value, index) => {
    const x = (index / (validData.length - 1)) * 160;
    const normalizedValue = (value - paddedMin) / (paddedMax - paddedMin);
    // Ensure minimum 5px difference for better visibility
    const y = Math.max(5, Math.min(55, 50 - (normalizedValue * 40)));
    return [x, y];
  });

  // Create a smooth line using quadratic bezier curves with adaptive smoothing
  let path = `M ${points[0][0]},${points[0][1]}`;
  
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    
    // Adjust smoothing based on data point distance
    const distance = Math.abs(y1 - y0);
    const smoothing = Math.min(0.2, Math.max(0.1, distance / 100));
    
    // Calculate control points
    const cp1x = x0 + (x1 - x0) * smoothing;
    const cp1y = y0;
    const cp2x = x1 - (x1 - x0) * smoothing;
    const cp2y = y1;
    
    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x1},${y1}`;
  }

  // Create gradient fill path
  const fillPath = `${path} L ${points[points.length - 1][0]},60 L ${points[0][0]},60 Z`;
  
  // Create unique gradient ID without special characters
  const gradientId = `gradient-${color.replace('#', '')}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <ChartContainer>
      <ChartSvg viewBox="0 0 160 60">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path
          d={fillPath}
          fill={`url(#${gradientId})`}
          strokeWidth="0"
        />
        <path
          d={path}
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