import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  Image,
  Text,
  Badge,
  Flex,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    back_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
    };
  }[];
}

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        setPokemon(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  const addToTeam = async () => {
    try {
      await axios.post('https://pokemon-backend-hd4h.onrender.com/team', {
        pokemonId: pokemon?.id,
        name: pokemon?.name,
        timestamp: new Date().toISOString(),
      });
      toast({
        title: 'Pokémon added to team',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error adding Pokémon to team',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!pokemon) {
    return <Text>Pokémon not found</Text>;
  }

  return (
    <Box maxW="1200px" mx="auto" px={4}>
      <Button onClick={() => navigate(-1)} mb={4}>
        Back to Pokédex
      </Button>
      <Card bg="whiteAlpha.200" backdropFilter="blur(10px)">
        <CardBody>
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 2fr' }}
            gap={6}
            alignItems="center"
          >
            <Box>
              <Image
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                mx="auto"
                h="300px"
                objectFit="contain"
              />
              <Flex justify="center" gap={2} mt={4}>
                {pokemon.types.map((type) => (
                  <Badge
                    key={type.type.name}
                    colorScheme={type.type.name}
                    variant="solid"
                    fontSize="lg"
                    px={3}
                    py={1}
                  >
                    {type.type.name}
                  </Badge>
                ))}
              </Flex>
            </Box>
            <Box>
              <Text fontSize="3xl" fontWeight="bold" textTransform="capitalize">
                {pokemon.name}
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={6}>
                {pokemon.stats.map((stat) => (
                  <Stat key={stat.stat.name}>
                    <StatLabel textTransform="capitalize">
                      {stat.stat.name}
                    </StatLabel>
                    <StatNumber>{stat.base_stat}</StatNumber>
                  </Stat>
                ))}
              </Grid>
              <Box mt={6}>
                <Text fontSize="lg" fontWeight="bold">
                  Abilities:
                </Text>
                <Flex gap={2} mt={2}>
                  {pokemon.abilities.map((ability) => (
                    <Badge
                      key={ability.ability.name}
                      colorScheme="purple"
                      variant="subtle"
                    >
                      {ability.ability.name}
                    </Badge>
                  ))}
                </Flex>
              </Box>
              <Button
                colorScheme="blue"
                mt={6}
                onClick={addToTeam}
                isDisabled={pokemon.stats.length === 0}
              >
                Add to Team
              </Button>
            </Box>
          </Grid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default PokemonDetail; 