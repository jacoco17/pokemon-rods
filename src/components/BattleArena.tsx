import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardBody,
  Image,
  Text,
  Badge,
  Flex,
  Button,
  Select,
  useToast,
  Heading,
  VStack,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import axios from 'axios';
import BattleHistory from './BattleHistory';

interface Round {
  stat: string;
  pokemon1Value: number;
  pokemon2Value: number;
  winner: string;
}

interface BattlePokemon {
  id: number;  // Pokemon's ID from PokeAPI
  teamId: number;  // Unique team entry ID
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
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
}

interface BattleResult {
  winner: string;
  rounds: Round[];
  totalStats1: number;
  totalStats2: number;
}

const BattleArena: React.FC = () => {
  const [team, setTeam] = useState<BattlePokemon[]>([]);
  const [selectedPokemon1, setSelectedPokemon1] = useState<BattlePokemon | null>(null);
  const [selectedPokemon2, setSelectedPokemon2] = useState<BattlePokemon | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
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

  const getRandomPokemon = async () => {
    try {
      // Get a random Pokémon ID between 1 and 151 (first generation)
      const randomId = Math.floor(Math.random() * 151) + 1;
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      setSelectedPokemon2(response.data);
    } catch (error) {
      console.error('Error fetching random Pokémon:', error);
    }
  };

  const simulateBattle = () => {
    if (!selectedPokemon1 || !selectedPokemon2) {
      toast({
        title: 'Select Pokémon',
        description: 'Please select both Pokémon for battle',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const rounds: Round[] = [];
    let pokemon1Wins = 0;
    let pokemon2Wins = 0;
    let totalStats1 = 0;
    let totalStats2 = 0;

    // Compare each stat
    const statsToCompare = ['hp', 'attack', 'defense', 'speed', 'special-attack', 'special-defense'];
    statsToCompare.forEach(statName => {
      const stat1 = selectedPokemon1.stats.find(s => s.stat.name === statName)?.base_stat || 0;
      const stat2 = selectedPokemon2.stats.find(s => s.stat.name === statName)?.base_stat || 0;
      
      totalStats1 += stat1;
      totalStats2 += stat2;

      rounds.push({
        stat: statName,
        pokemon1Value: stat1,
        pokemon2Value: stat2,
        winner: stat1 > stat2 ? selectedPokemon1.name : (stat1 < stat2 ? selectedPokemon2.name : 'tie')
      });

      if (stat1 > stat2) pokemon1Wins++;
      else if (stat2 > stat1) pokemon2Wins++;
    });

    const winner = pokemon1Wins > pokemon2Wins ? selectedPokemon1.name : selectedPokemon2.name;
    const result: BattleResult = {
      winner,
      rounds,
      totalStats1,
      totalStats2
    };

    setBattleResult(result);

    // Save battle result
    axios.post('https://pokemon-backend-hd4h.onrender.com/battles', {
      pokemon1: selectedPokemon1.name,
      pokemon2: selectedPokemon2.name,
      winner,
      timestamp: new Date().toISOString(),
      battleDetails: rounds
    });
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      grass: '#78C850',
      poison: '#A040A0',
      fire: '#F08030',
      flying: '#A890F0',
      water: '#6890F0',
      bug: '#A8B820',
      normal: '#A8A878',
      electric: '#F8D030',
      ground: '#E0C068',
      fairy: '#EE99AC',
      fighting: '#C03028',
      psychic: '#F85888',
      rock: '#B8A038',
      steel: '#B8B8D0',
      ice: '#98D8D8',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
    };
    return colors[type] || 'gray.500';
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box maxW="1200px" mx="auto" px={4}>
      <Heading mb={6} textAlign="center" color="white">
        Battle Arena
      </Heading>
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
        <Box>
          <Select
            placeholder="Select Your Pokémon"
            mb={4}
            bg="white"
            color="black"
            onChange={(e) => {
              const pokemon = team.find((p) => p.teamId === parseInt(e.target.value));
              setSelectedPokemon1(pokemon || null);
            }}
          >
            {team.map((pokemon) => (
              <option key={pokemon.teamId} value={pokemon.teamId}>
                {pokemon.name}
              </option>
            ))}
          </Select>
          {selectedPokemon1 && (
            <Card bg="white">
              <CardBody>
                <VStack spacing={3}>
                  <Heading size="md" color="black">{selectedPokemon1.name}</Heading>
                  <Image
                    src={selectedPokemon1.sprites.other['official-artwork'].front_default}
                    alt={selectedPokemon1.name}
                    h="200px"
                    objectFit="contain"
                  />
                  <Flex gap={2}>
                    {selectedPokemon1.types.map((type) => (
                      <Badge
                        key={type.type.name}
                        bg={getTypeColor(type.type.name)}
                        color="white"
                        px={2}
                        py={1}
                      >
                        {type.type.name}
                      </Badge>
                    ))}
                  </Flex>
                  {selectedPokemon1.stats.map((stat) => (
                    <Box key={stat.stat.name} w="full">
                      <Flex justify="space-between">
                        <Text color="black" textTransform="capitalize">{stat.stat.name}</Text>
                        <Text color="black">{stat.base_stat}</Text>
                      </Flex>
                      <Progress value={stat.base_stat} max={255} colorScheme="blue" />
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          )}
        </Box>
        <Box>
          <Flex mb={4} gap={2}>
            <Button
              colorScheme="purple"
              onClick={getRandomPokemon}
              flex={1}
            >
              Random Opponent
            </Button>
          </Flex>
          {selectedPokemon2 && (
            <Card bg="white">
              <CardBody>
                <VStack spacing={3}>
                  <Heading size="md" color="black">{selectedPokemon2.name}</Heading>
                  <Image
                    src={selectedPokemon2.sprites.other['official-artwork'].front_default}
                    alt={selectedPokemon2.name}
                    h="200px"
                    objectFit="contain"
                  />
                  <Flex gap={2}>
                    {selectedPokemon2.types.map((type) => (
                      <Badge
                        key={type.type.name}
                        bg={getTypeColor(type.type.name)}
                        color="white"
                        px={2}
                        py={1}
                      >
                        {type.type.name}
                      </Badge>
                    ))}
                  </Flex>
                  {selectedPokemon2.stats.map((stat) => (
                    <Box key={stat.stat.name} w="full">
                      <Flex justify="space-between">
                        <Text color="black" textTransform="capitalize">{stat.stat.name}</Text>
                        <Text color="black">{stat.base_stat}</Text>
                      </Flex>
                      <Progress value={stat.base_stat} max={255} colorScheme="red" />
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          )}
        </Box>
      </Grid>

      <Flex justify="center" mt={8}>
        <Button
          colorScheme="red"
          size="lg"
          onClick={simulateBattle}
          isDisabled={!selectedPokemon1 || !selectedPokemon2}
        >
          Battle!
        </Button>
      </Flex>

      {battleResult && (
        <Box mt={8}>
          <Alert
            status={battleResult.winner === selectedPokemon1?.name ? 'success' : 'error'}
            variant="solid"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            borderRadius="lg"
            mb={4}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Battle Result
            </AlertTitle>
            <AlertDescription maxWidth="sm" fontSize="lg">
              {battleResult.winner} wins!
              <Text mt={2} fontWeight="bold">
                Total Stats - {selectedPokemon1?.name}: {battleResult.totalStats1} vs {selectedPokemon2?.name}: {battleResult.totalStats2}
              </Text>
            </AlertDescription>
          </Alert>

          <Table variant="simple" bg="gray.800" color="white" borderRadius="lg">
            <Thead>
              <Tr>
                <Th color="gray.200">Stat</Th>
                <Th color="gray.200">{selectedPokemon1?.name}</Th>
                <Th color="gray.200">{selectedPokemon2?.name}</Th>
                <Th color="gray.200">Winner</Th>
              </Tr>
            </Thead>
            <Tbody>
              {battleResult.rounds.map((round, index) => (
                <Tr key={index}>
                  <Td textTransform="capitalize" color="white">{round.stat}</Td>
                  <Td color="white">{round.pokemon1Value}</Td>
                  <Td color="white">{round.pokemon2Value}</Td>
                  <Td textTransform="capitalize" color="white" fontWeight={round.winner === battleResult.winner ? "bold" : "normal"}>{round.winner}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <Box mt={12}>
        <BattleHistory />
      </Box>
    </Box>
  );
};

export default BattleArena; 