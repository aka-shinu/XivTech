import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: ${props => props.active ? '#1976d2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.active ? '#1565c0' : '#f5f5f5'};
  }
`;

export type FilterType = 'all' | 'gainers' | 'losers';
export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'price' | 'marketCap' | 'volume' | 'change24h';

interface FilterControlsProps {
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ filterType, onFilterChange }) => {
  return (
    <FilterContainer>
      <FilterButton
        active={filterType === 'all'}
        onClick={() => onFilterChange('all')}
      >
        All
      </FilterButton>
      <FilterButton
        active={filterType === 'gainers'}
        onClick={() => onFilterChange('gainers')}
      >
        Gainers
      </FilterButton>
      <FilterButton
        active={filterType === 'losers'}
        onClick={() => onFilterChange('losers')}
      >
        Losers
      </FilterButton>
    </FilterContainer>
  );
}; 