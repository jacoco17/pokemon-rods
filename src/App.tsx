import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import TeamBuilder from './components/TeamBuilder';
import Battle from './components/Battle';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <Container maxW="container.xl" py={5}>
        <Navigation />
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/team" element={<TeamBuilder />} />
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App; 