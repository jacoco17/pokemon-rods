import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  SimpleGrid,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  Flex,
  Spinner,
  Container,
  HStack,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { PokemonCard } from './PokemonCard';
import { Pokemon } from '../types';

const PokemonList = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(66);
  const limit = 8;

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * limit;
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
        );
        const pokemonData = await Promise.all(
          response.data.results.map(async (p: { url: string }) => {
            const pokemonResponse = await axios.get(p.url);
            return {
              id: pokemonResponse.data.id,
              name: pokemonResponse.data.name,
              sprites: {
                front_default: pokemonResponse.data.sprites.front_default
              },
              types: pokemonResponse.data.types,
              stats: pokemonResponse.data.stats
            };
          })
        );
        setPokemon(pokemonData);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      }
      setLoading(false);
    };

    fetchPokemon();
  }, [page]);

  const handleTeamUpdate = () => {
    // This function will be called when a Pokemon is added to the team
    // It will trigger a re-render of the PokemonList component
    setPokemon([...pokemon]);
  };

  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    // Always show first page
    buttons.push(
      <Button
        key={1}
        onClick={() => setPage(1)}
        variant={page === 1 ? 'solid' : 'ghost'}
      >
        1
      </Button>
    );

    // Calculate range of visible page numbers
    let startPage = Math.max(2, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (startPage > 2) {
      buttons.push(<Text key="ellipsis1">...</Text>);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => setPage(i)}
          variant={page === i ? 'solid' : 'ghost'}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages - 1) {
      buttons.push(<Text key="ellipsis2">...</Text>);
    }

    // Always show last page
    buttons.push(
      <Button
        key={totalPages}
        onClick={() => setPage(totalPages)}
        variant={page === totalPages ? 'solid' : 'ghost'}
      >
        {totalPages}
      </Button>
    );

    return buttons;
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box maxW="800px" mx="auto" mb={12}>
        <InputGroup>
          <Input
            placeholder="Search Pokemon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="lg"
          />
          <InputRightElement pointerEvents="none" h="full">
            <SearchIcon color="whiteAlpha.500" />
          </InputRightElement>
        </InputGroup>
      </Box>

      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" color="whiteAlpha.900" />
        </Flex>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {filteredPokemon.map((p) => (
              <PokemonCard key={p.id} pokemon={p} onTeamUpdate={handleTeamUpdate} />
            ))}
          </SimpleGrid>
          
          <Flex justify="center" mt={12} mb={6}>
            <HStack spacing={2}>
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                isDisabled={page === 1}
                variant="ghost"
              >
                ←
              </Button>
              {renderPaginationButtons()}
              <Button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                isDisabled={page === totalPages}
                variant="ghost"
              >
                →
              </Button>
            </HStack>
          </Flex>
          
          <Text textAlign="center" color="whiteAlpha.700">
            Page {page} of {totalPages}
          </Text>
        </>
      )}
    </Container>
  );
};

export default PokemonList; 