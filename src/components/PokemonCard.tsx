import React from 'react';
import { Pokemon } from '../types';
import {
  Card,
  CardBody,
  Text,
  Box,
  Badge,
  Progress,
  Button,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

interface PokemonCardProps {
  pokemon: Pokemon;
  onTeamUpdate?: () => void;
}

const typeColors: { [key: string]: string } = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onTeamUpdate }) => {
  const toast = useToast();

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleAddToTeam = async () => {
    try {
      // First check if the team is full
      const teamResponse = await axios.get('/api/team');
      if (teamResponse.data.length >= 6) {
        toast({
          title: 'Team Full',
          description: 'You can only have 6 Pokemon in your team',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Check if Pokemon is already in team
      if (teamResponse.data.some((p: any) => p.pokemonId === pokemon.id)) {
        toast({
          title: 'Already in Team',
          description: 'This Pokemon is already in your team',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Add Pokemon to team
      await axios.post('/api/team', {
        pokemonId: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.front_default,
        types: pokemon.types,
        stats: pokemon.stats,
      });

      toast({
        title: 'Pokemon Added',
        description: `${capitalizeFirstLetter(pokemon.name)} has been added to your team`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Call the onTeamUpdate callback if provided
      if (onTeamUpdate) {
        onTeamUpdate();
      }
    } catch (error) {
      console.error('Error adding to team:', error);
      toast({
        title: 'Error',
        description: 'Failed to add Pokemon to team',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Card maxW="sm" m={2}>
      <CardBody>
        <Box display="flex" alignItems="center" mb={2}>
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            style={{ width: 96, height: 96 }}
          />
          <Box ml={2}>
            <Text fontSize="xl" fontWeight="bold">
              {capitalizeFirstLetter(pokemon.name)}
            </Text>
            <Text color="gray.500">
              #{pokemon.id.toString().padStart(3, '0')}
            </Text>
          </Box>
        </Box>

        <Box mb={2}>
          {pokemon.types.map((type) => (
            <Badge
              key={type.type.name}
              mr={1}
              bg={typeColors[type.type.name] || '#777'}
              color="white"
            >
              {capitalizeFirstLetter(type.type.name)}
            </Badge>
          ))}
        </Box>

        <Box>
          {pokemon.stats.map((stat) => (
            <Box key={stat.stat.name} mb={1}>
              <Text fontSize="sm" mb={0.5}>
                {capitalizeFirstLetter(stat.stat.name)}: {stat.base_stat}
              </Text>
              <Progress
                value={(stat.base_stat / 255) * 100}
                size="sm"
                borderRadius="md"
                bg="gray.200"
                colorScheme={stat.base_stat > 100 ? 'green' : 'blue'}
              />
            </Box>
          ))}
        </Box>

        <Button
          colorScheme="blue"
          onClick={handleAddToTeam}
          mt={4}
          width="100%"
          color="white"
        >
          Add to Team
        </Button>
      </CardBody>
    </Card>
  );
}; 