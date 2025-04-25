import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, HStack, Text, Link } from '@chakra-ui/react';

const Navigation = () => {
  return (
    <Box
      bg="rgba(18, 18, 18, 0.8)"
      py={4}
      px={8}
      mb={8}
      borderRadius="12px"
      boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
      backdropFilter="blur(8px)"
      border="1px solid rgba(255, 255, 255, 0.05)"
    >
      <Container maxW="container.xl">
        <HStack spacing={8} justify="center" align="center">
          <Text
            fontSize="2xl"
            fontWeight="600"
            bgGradient="linear(135deg, #00f2fe 0%, #4facfe 100%)"
            bgClip="text"
            letterSpacing="1px"
          >
            Pokemon
          </Text>
          <Link
            as={RouterLink}
            to="/"
            color="whiteAlpha.900"
            fontWeight="500"
            fontSize="md"
            px={4}
            py={2}
            borderRadius="8px"
            transition="all 0.3s ease"
            _hover={{
              bg: 'whiteAlpha.100',
              textDecoration: 'none',
            }}
          >
            Home
          </Link>
          <Link
            as={RouterLink}
            to="/team"
            color="whiteAlpha.900"
            fontWeight="500"
            fontSize="md"
            px={4}
            py={2}
            borderRadius="8px"
            transition="all 0.3s ease"
            _hover={{
              bg: 'whiteAlpha.100',
              textDecoration: 'none',
            }}
          >
            Team
          </Link>
          <Link
            as={RouterLink}
            to="/battle"
            color="whiteAlpha.900"
            fontWeight="500"
            fontSize="md"
            px={4}
            py={2}
            borderRadius="8px"
            transition="all 0.3s ease"
            _hover={{
              bg: 'whiteAlpha.100',
              textDecoration: 'none',
            }}
          >
            Battle
          </Link>
        </HStack>
      </Container>
    </Box>
  );
};

export default Navigation; 