import React from 'react';
import { Box, Flex, Link, Button, Image } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <Box bg="blackAlpha.800" px={4} py={2} borderBottom="1px" borderColor="whiteAlpha.200">
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
        <Link as={RouterLink} to="/">
          <Image
            src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
            alt="PokéAPI"
            h="50px"
          />
        </Link>
        <Flex gap={4}>
          <Button
            as={RouterLink}
            to="/"
            variant="ghost"
            colorScheme="yellow"
            fontFamily="Poppins"
            fontWeight="500"
            fontSize="md"
            letterSpacing="0.5px"
            _hover={{ bg: 'yellow.500', color: 'white' }}
          >
            Pokédex
          </Button>
          <Button
            as={RouterLink}
            to="/team"
            variant="ghost"
            colorScheme="blue"
            fontFamily="Poppins"
            fontWeight="500"
            fontSize="md"
            letterSpacing="0.5px"
            _hover={{ bg: 'blue.500', color: 'white' }}
          >
            My Team
          </Button>
          <Button
            as={RouterLink}
            to="/battle"
            variant="ghost"
            colorScheme="red"
            fontFamily="Poppins"
            fontWeight="500"
            fontSize="md"
            letterSpacing="0.5px"
            _hover={{ bg: 'red.500', color: 'white' }}
          >
            Battle
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar; 