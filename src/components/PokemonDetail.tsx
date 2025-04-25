import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PokemonImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
`;

const StatBar = styled.div<{ value: number }>`
  height: 20px;
  background-color: #ff0000;
  width: ${(props) => (props.value / 255) * 100}%;
  border-radius: 4px;
`;

const AddToTeamButton = styled.button`
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;

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
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
}

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        setPokemon(response.data);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      }
      setLoading(false);
    };

    fetchPokemon();
  }, [id]);

  const addToTeam = async () => {
    if (!pokemon) return;
    try {
      await axios.post('/api/team', {
        pokemonId: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.front_default,
      });
      alert('Pokemon added to team!');
    } catch (error) {
      console.error('Error adding to team:', error);
      alert('Failed to add Pokemon to team');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!pokemon) return <div>Pokemon not found</div>;

  return (
    <Container>
      <h1>{pokemon.name}</h1>
      <PokemonImage src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h2>Stats</h2>
      {pokemon.stats.map((stat) => (
        <div key={stat.stat.name}>
          <p>
            {stat.stat.name}: {stat.base_stat}
          </p>
          <StatBar value={stat.base_stat} />
        </div>
      ))}
      <h2>Types</h2>
      <div>
        {pokemon.types.map((type) => (
          <span key={type.type.name}>{type.type.name} </span>
        ))}
      </div>
      <AddToTeamButton onClick={addToTeam}>Add to Team</AddToTeamButton>
    </Container>
  );
};

export default PokemonDetail; 