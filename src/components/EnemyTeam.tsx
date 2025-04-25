import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`;

const PokemonCard = styled.div`
  background: #f8f8f8;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s;
  border: 2px solid #ff0000;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PokemonImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const RefreshButton = styled.button`
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: bold;

  &:hover {
    background-color: #cc0000;
  }
`;

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

const EnemyTeam = () => {
  const [enemyTeam, setEnemyTeam] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  const generateRandomTeam = async () => {
    setLoading(true);
    try {
      const teamSize = 6;
      const randomIds = Array.from({ length: teamSize }, () =>
        Math.floor(Math.random() * 151) + 1
      );

      const teamPromises = randomIds.map((id) =>
        axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      );

      const responses = await Promise.all(teamPromises);
      const team = responses.map((response) => response.data);
      setEnemyTeam(team);
    } catch (error) {
      console.error('Error generating enemy team:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    generateRandomTeam();
  }, []);

  if (loading) return <div>Loading enemy team...</div>;

  return (
    <Container>
      <h2>Enemy Team</h2>
      <TeamGrid>
        {enemyTeam.map((pokemon) => (
          <PokemonCard key={pokemon.id}>
            <PokemonImage src={pokemon.sprites.front_default} alt={pokemon.name} />
            <h3>{pokemon.name}</h3>
          </PokemonCard>
        ))}
      </TeamGrid>
      <RefreshButton onClick={generateRandomTeam}>Generate New Team</RefreshButton>
    </Container>
  );
};

export default EnemyTeam; 