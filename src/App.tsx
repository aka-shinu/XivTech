import { Provider } from 'react-redux';
import { store } from './store/store';
import { CryptoTable } from './components/CryptoTable';
import styled from 'styled-components';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #1e2329;
  margin: 0;
  padding: 20px 0;
`;

function App() {
  return (
    <Provider store={store}>
      <AppContainer>
        <Header>
          <Title>Cryptocurrency Prices</Title>
        </Header>
        <CryptoTable />
      </AppContainer>
    </Provider>
  );
}

export default App; 