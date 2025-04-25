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
  Badge,
  Flex,
} from '@chakra-ui/react';

interface TeamPokemon {
  id: number;
  pokemonId: number;
  name: string;
  image: string;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
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

const CARDS_PER_PAGE = 6;

const TeamBuilder = () => {
  const [team, setTeam] = useState<TeamPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
    fetchTeam();
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

  const removeFromTeam = async (id: number) => {
    try {
      await axios.delete(`/api/team/${id}`);
      setTeam(team.filter((pokemon) => pokemon.id !== id));
      toast({
        title: 'Success',
        description: 'Pokemon removed from team',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error removing from team:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove Pokemon from team',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const totalPages = Math.ceil(team.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const currentTeam = team.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="whiteAlpha.900" />
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
          My Team
        </Text>

        {team.length === 0 ? (
          <Center>
            <Text fontSize="xl" color="whiteAlpha.800">
              Your team is empty. Add Pokemon from the Pokemon list!
            </Text>
          </Center>
        ) : (
          <>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={6}
            >
              {currentTeam.map((pokemon) => (
                <Box
                  key={pokemon.id}
                  bg="rgba(18, 18, 18, 0.8)"
                  borderRadius="12px"
                  p={6}
                  boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
                  backdropFilter="blur(8px)"
                  border="1px solid rgba(255, 255, 255, 0.05)"
                >
                  <VStack spacing={4} align="stretch">
                    <Center>
                      <Image
                        src={pokemon.image}
                        alt={pokemon.name}
                        boxSize="150px"
                        objectFit="contain"
                      />
                    </Center>

                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      textAlign="center"
                      color="whiteAlpha.900"
                    >
                      {capitalizeFirstLetter(pokemon.name)}
                    </Text>

                    <HStack justify="center" spacing={2}>
                      {pokemon.types?.map((type) => (
                        <Badge
                          key={type.type.name}
                          px={3}
                          py={1}
                          bg={typeColors[type.type.name] || '#777'}
                          color="white"
                          fontSize="md"
                        >
                          {capitalizeFirstLetter(type.type.name)}
                        </Badge>
                      ))}
                    </HStack>

                    <Button
                      colorScheme="red"
                      onClick={() => removeFromTeam(pokemon.id)}
                      mt={4}
                      color="white"
                    >
                      Remove from Team
                    </Button>
                  </VStack>
                </Box>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Flex justify="center" mt={8} gap={2}>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  isDisabled={currentPage === 1}
                  colorScheme="blue"
                  variant="outline"
                >
                  Previous
                </Button>
                <Text color="whiteAlpha.900">
                  Page {currentPage} of {totalPages}
                </Text>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  isDisabled={currentPage === totalPages}
                  colorScheme="blue"
                  variant="outline"
                >
                  Next
                </Button>
              </Flex>
            )}
          </>
        )}
      </VStack>
    </Container>
  );
};

export default TeamBuilder; 