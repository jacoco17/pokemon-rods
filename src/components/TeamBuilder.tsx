import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Text,
  Badge,
  Flex,
  Button,
  useToast,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';

interface TeamPokemon {
  id: number;  // This is the Pokemon's ID from PokeAPI
  teamId: number;  // This will store the unique team entry ID
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

const TeamBuilder: React.FC = () => {
  const [team, setTeam] = useState<TeamPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/team`);
      const teamData = await Promise.all(
        response.data.map(async (pokemon: { pokemonId: number, id: number }) => {
          const pokemonResponse = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.pokemonId}`
          );
          return {
            ...pokemonResponse.data,
            teamId: pokemon.id  // Store the unique team entry ID
          };
        })
      );
      setTeam(teamData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team:', error);
      setLoading(false);
    }
  };

  const removeFromTeam = async (teamId: number) => {
    try {
      await axios.delete(`https://pokemon-backend-hd4h.onrender.com/team/${teamId}`);
      setTeam(team.filter((p) => p.teamId !== teamId));
      toast({
        title: 'Pokémon removed from team',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error removing Pokémon from team',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Text>Loading team...</Text>;
  }

  return (
    <Box maxW="1200px" mx="auto" px={4}>
      <Heading mb={6} textAlign="center">
        My Pokémon Team
      </Heading>
      {team.length === 0 ? (
        <Text textAlign="center" fontSize="xl">
          Your team is empty. Add Pokémon from the Pokédex!
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {team.map((pokemon) => (
            <Card
              key={pokemon.teamId}
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
            >
              <CardBody>
                <Image
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  mx="auto"
                  h="200px"
                  objectFit="contain"
                />
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  textTransform="capitalize"
                  textAlign="center"
                  mt={4}
                >
                  {pokemon.name}
                </Text>
                <Flex justify="center" gap={2} mt={2}>
                  {pokemon.types.map((type) => (
                    <Badge
                      key={type.type.name}
                      colorScheme={type.type.name}
                      variant="solid"
                    >
                      {type.type.name}
                    </Badge>
                  ))}
                </Flex>
                <Button
                  colorScheme="red"
                  mt={4}
                  w="full"
                  onClick={() => removeFromTeam(pokemon.teamId)}
                >
                  Remove from Team
                </Button>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default TeamBuilder; 