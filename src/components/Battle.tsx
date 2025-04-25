import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Text,
  Image,
  Button,
  useToast,
  Center,
  Spinner,
  VStack,
  HStack,
  Select,
  Badge,
  Progress,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
} from '@chakra-ui/react';

interface TeamPokemon {
  id: number;
  pokemonId: number;
  name: string;
  image: string;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

interface BattleResult {
  winner: string;
  loser: string;
  date: string;
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

const Battle = () => {
  const [team, setTeam] = useState<TeamPokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);
  const [selectedEnemyPokemon, setSelectedEnemyPokemon] = useState<number | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [battleHistory, setBattleHistory] = useState<BattleResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [enemyTeam, setEnemyTeam] = useState<any[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchTeam();
    generateEnemyTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/team');
      setTeam(response.data);
    } catch (error) {
      console.error('Error fetching team:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your team',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const generateEnemyTeam = async () => {
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
      toast({
        title: 'Error',
        description: 'Failed to generate enemy team',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const simulateBattle = async () => {
    if (!selectedPokemon || !selectedEnemyPokemon) {
      toast({
        title: 'Error',
        description: 'Please select both Pokemon to battle',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const myPokemon = team.find((p) => p.id === selectedPokemon);
    const enemyPokemon = enemyTeam[selectedEnemyPokemon];

    if (!myPokemon || !enemyPokemon) return;

    try {
      const response1 = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${myPokemon.pokemonId}`
      );
      const response2 = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${enemyPokemon.id}`
      );

      const stats1 = {
        hp: response1.data.stats[0].base_stat,
        attack: response1.data.stats[1].base_stat,
        speed: response1.data.stats[5].base_stat,
      };

      const stats2 = {
        hp: response2.data.stats[0].base_stat,
        attack: response2.data.stats[1].base_stat,
        speed: response2.data.stats[5].base_stat,
      };

      let roundsWon1 = 0;
      let roundsWon2 = 0;

      if (stats1.hp > stats2.hp) roundsWon1++;
      else if (stats2.hp > stats1.hp) roundsWon2++;

      if (stats1.attack > stats2.attack) roundsWon1++;
      else if (stats2.attack > stats1.attack) roundsWon2++;

      if (stats1.speed > stats2.speed) roundsWon1++;
      else if (stats2.speed > stats1.speed) roundsWon2++;

      const winner = roundsWon1 > roundsWon2 ? myPokemon : enemyPokemon;
      const loser = winner === myPokemon ? enemyPokemon : myPokemon;

      const result = {
        winner: winner.name,
        loser: loser.name,
        date: new Date().toISOString(),
      };

      setBattleResult(result);
      setBattleHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10 battles
      onOpen();
    } catch (error) {
      console.error('Error simulating battle:', error);
      toast({
        title: 'Error',
        description: 'Failed to simulate battle',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="whiteAlpha.900" />
      </Center>
    );
  }

  if (team.length === 0) {
    return (
      <Center h="50vh">
        <Text fontSize="xl" color="whiteAlpha.800">
          You need at least 1 Pokemon in your team to battle!
        </Text>
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Text
          fontSize="3xl"
          fontWeight="bold"
          textAlign="center"
          bgGradient="linear(135deg, #00f2fe 0%, #4facfe 100%)"
          bgClip="text"
        >
          Battle Arena
        </Text>

        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={8}
          mt={8}
        >
          {/* Your Team */}
          <Box
            bg="rgba(18, 18, 18, 0.8)"
            borderRadius="12px"
            p={6}
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
            backdropFilter="blur(8px)"
            border="1px solid rgba(255, 255, 255, 0.05)"
          >
            <Text fontSize="xl" fontWeight="bold" color="whiteAlpha.900" mb={4}>
              Your Team
            </Text>
            <Select
              placeholder="Select your Pokemon"
              value={selectedPokemon || ''}
              onChange={(e) => setSelectedPokemon(Number(e.target.value))}
              color="white"
              borderColor="whiteAlpha.300"
              _hover={{ borderColor: 'whiteAlpha.400' }}
              mb={4}
            >
              {team.map((pokemon) => (
                <option key={pokemon.id} value={pokemon.id} style={{ background: '#121212' }}>
                  {capitalizeFirstLetter(pokemon.name)}
                </option>
              ))}
            </Select>
            {selectedPokemon && (
              <Box>
                <Image
                  src={team.find(p => p.id === selectedPokemon)?.image}
                  alt="Selected Pokemon"
                  boxSize="200px"
                  objectFit="contain"
                  mx="auto"
                />
              </Box>
            )}
          </Box>

          {/* Enemy Team */}
          <Box
            bg="rgba(18, 18, 18, 0.8)"
            borderRadius="12px"
            p={6}
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
            backdropFilter="blur(8px)"
            border="1px solid rgba(255, 255, 255, 0.05)"
          >
            <Text fontSize="xl" fontWeight="bold" color="whiteAlpha.900" mb={4}>
              Enemy Team
            </Text>
            <Select
              placeholder="Select enemy Pokemon"
              value={selectedEnemyPokemon || ''}
              onChange={(e) => setSelectedEnemyPokemon(Number(e.target.value))}
              color="white"
              borderColor="whiteAlpha.300"
              _hover={{ borderColor: 'whiteAlpha.400' }}
              mb={4}
            >
              {enemyTeam.map((pokemon, index) => (
                <option key={index} value={index} style={{ background: '#121212' }}>
                  {capitalizeFirstLetter(pokemon.name)}
                </option>
              ))}
            </Select>
            {selectedEnemyPokemon !== null && (
              <Box>
                <Image
                  src={enemyTeam[selectedEnemyPokemon]?.sprites.front_default}
                  alt="Selected Enemy Pokemon"
                  boxSize="200px"
                  objectFit="contain"
                  mx="auto"
                />
              </Box>
            )}
          </Box>
        </Grid>

        <Center>
          <Button
            colorScheme="red"
            size="lg"
            onClick={simulateBattle}
            isDisabled={!selectedPokemon || !selectedEnemyPokemon}
            color="white"
          >
            Battle!
          </Button>
        </Center>

        <Divider borderColor="whiteAlpha.300" />

        <Box>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            mb={4}
            bgGradient="linear(135deg, #00f2fe 0%, #4facfe 100%)"
            bgClip="text"
          >
            Battle History
          </Text>
          
          {battleHistory.length === 0 ? (
            <Text color="whiteAlpha.800" textAlign="center">
              No battles recorded yet
            </Text>
          ) : (
            <Box
              bg="rgba(18, 18, 18, 0.8)"
              borderRadius="12px"
              p={6}
              boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
              backdropFilter="blur(8px)"
              border="1px solid rgba(255, 255, 255, 0.05)"
            >
              <Table variant="simple" colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th color="whiteAlpha.900">Date</Th>
                    <Th color="whiteAlpha.900">Winner</Th>
                    <Th color="whiteAlpha.900">Loser</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {battleHistory.map((battle, index) => (
                    <Tr key={index}>
                      <Td color="whiteAlpha.800">
                        {new Date(battle.date).toLocaleString()}
                      </Td>
                      <Td color="whiteAlpha.800">
                        {capitalizeFirstLetter(battle.winner)}
                      </Td>
                      <Td color="whiteAlpha.800">
                        {capitalizeFirstLetter(battle.loser)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent
            bg="rgba(18, 18, 18, 0.95)"
            border="1px solid rgba(255, 255, 255, 0.1)"
          >
            <ModalHeader color="whiteAlpha.900">
              Battle Result
            </ModalHeader>
            <ModalCloseButton color="whiteAlpha.900" />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Text fontSize="2xl" color="whiteAlpha.900">
                  Winner: {capitalizeFirstLetter(battleResult?.winner || '')}
                </Text>
                <Text fontSize="xl" color="whiteAlpha.800">
                  Loser: {capitalizeFirstLetter(battleResult?.loser || '')}
                </Text>
                <Text fontSize="sm" color="whiteAlpha.600">
                  {new Date(battleResult?.date || '').toLocaleString()}
                </Text>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default Battle; 