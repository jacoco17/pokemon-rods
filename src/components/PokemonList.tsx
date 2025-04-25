import React, { useState, useEffect } from 'react';
import {
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Text,
  Badge,
  Flex,
  Box,
  Input,
  Button,
  IconButton,
  useToast,
  HStack,
  VStack,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Pokemon {
  id: number;
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
  height: number;
  weight: number;
}

const PokemonList: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;
  const maxPages = 60; // Limit to first 600 Pokemon (60 pages * 10 per page)
  const navigate = useNavigate();
  const toast = useToast();

  const fetchPokemon = async (page: number) => {
    try {
      const offset = (page - 1) * limit;
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const count = Math.min(response.data.count, maxPages * limit);
      setTotalPages(Math.min(Math.ceil(count / limit), maxPages));

      const pokemonData = await Promise.all(
        response.data.results.map(async (p: { url: string }) => {
          const pokemonResponse = await axios.get(p.url);
          return pokemonResponse.data;
        })
      );
      setPokemon(pokemonData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon(currentPage);
  }, [currentPage]);

  const addToTeam = async (pokemon: Pokemon) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/team`);
      if (response.data.length >= 6) {
        toast({
          title: 'Team is full',
          description: 'You can only have 6 Pokémon in your team',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Check for duplicate Pokemon
      const isDuplicate = response.data.some((p: { pokemonId: number }) => p.pokemonId === pokemon.id);
      if (isDuplicate) {
        toast({
          title: 'Duplicate Pokemon',
          description: `${pokemon.name} is already in your team`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await axios.post('https://pokemon-backend-hd4h.onrender.com/team', {
        pokemonId: pokemon.id,
        name: pokemon.name,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: 'Success',
        description: `${pokemon.name} added to your team!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add Pokémon to team',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getContrastColor = (type: string) => {
    const darkTypes = ['grass', 'electric', 'fairy', 'ice'];
    return darkTypes.includes(type) ? 'black' : 'white';
  };

  return (
    <Box maxW="1200px" mx="auto" px={4}>
      <Flex mb={6} gap={4}>
        <Input
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          bg="white"
          color="black"
          _placeholder={{ color: 'gray.500' }}
        />
      </Flex>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
        {filteredPokemon.map((p) => (
          <Card
            key={p.id}
            bg="white"
            backdropFilter="blur(10px)"
            borderRadius="lg"
            overflow="hidden"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bg: `linear-gradient(180deg, ${getTypeColor(p.types[0].type.name)}33 0%, ${getTypeColor(p.types[0].type.name)}66 100%)`,
              opacity: 0.3,
              zIndex: 0,
            }}
          >
            <CardBody position="relative" zIndex={1} p={3}>
              <VStack spacing={1}>
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  textAlign="center"
                  color="black"
                  textTransform="capitalize"
                >
                  •{p.name}•
                </Text>
                <Image
                  src={p.sprites.other['official-artwork'].front_default}
                  alt={p.name}
                  mx="auto"
                  h="120px"
                  objectFit="contain"
                />
                <Flex gap={1} justify="center">
                  {p.types.map((type) => (
                    <Badge
                      key={type.type.name}
                      bg={getTypeColor(type.type.name)}
                      color="black"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      textTransform="uppercase"
                      fontSize="2xs"
                      fontWeight="bold"
                    >
                      {type.type.name}
                    </Badge>
                  ))}
                </Flex>
                <Divider borderColor="blackAlpha.300" />
                <Flex justify="space-between" w="full" color="black">
                  <VStack align="start" spacing={0}>
                    <Text fontSize="2xs">Height</Text>
                    <Text fontSize="xs" fontWeight="bold">{p.height / 10}M</Text>
                  </VStack>
                  <VStack align="end" spacing={0}>
                    <Text fontSize="2xs">Weight</Text>
                    <Text fontSize="xs" fontWeight="bold">{p.weight / 10}KG</Text>
                  </VStack>
                </Flex>
                <Button
                  size="xs"
                  w="full"
                  variant="solid"
                  bg="blackAlpha.200"
                  color="black"
                  _hover={{ bg: 'blackAlpha.300' }}
                  onClick={() => addToTeam(p)}
                >
                  Add to Team
                </Button>
                <Button
                  size="xs"
                  w="full"
                  variant="solid"
                  bg="blackAlpha.200"
                  color="black"
                  _hover={{ bg: 'blackAlpha.300' }}
                  onClick={() => navigate(`/pokemon/${p.id}`)}
                >
                  More Details
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
      <Flex justify="center" mt={8} gap={4}>
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          isDisabled={currentPage === 1}
          colorScheme="blackAlpha"
          size="sm"
        >
          Previous
        </Button>
        <Text color="white" alignSelf="center" fontWeight="bold">
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          isDisabled={currentPage === totalPages}
          colorScheme="blackAlpha"
          size="sm"
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default PokemonList; 