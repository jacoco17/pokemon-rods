import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Badge,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
} from '@chakra-ui/react';
import axios from 'axios';

interface BattleDetail {
  stat: string;
  pokemon1Value: number;
  pokemon2Value: number;
  winner: string;
}

interface Battle {
  id: number;
  pokemon1: string;
  pokemon2: string;
  winner: string;
  timestamp: string;
  battleDetails?: BattleDetail[];
}

const BattleHistory: React.FC = () => {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    fetchBattles();
  }, []);

  const fetchBattles = async () => {
    try {
      const response = await axios.get('https://pokemon-backend-hd4h.onrender.com/battles');
      setBattles(response.data.reverse()); // Show newest battles first
      setLoading(false);
    } catch (error) {
      console.error('Error fetching battles:', error);
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    setIsClearing(true);
    try {
      // Delete battles one by one to avoid overwhelming the server
      for (const battle of battles) {
        try {
          await axios.delete(`https://pokemon-backend-hd4h.onrender.com/battles/${battle.id}`);
        } catch (error) {
          console.error(`Error deleting battle ${battle.id}:`, error);
          throw error; // Re-throw to trigger the outer catch block
        }
      }
      
      setBattles([]);
      toast({
        title: 'Battle history cleared',
        description: 'All battle records have been deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error clearing battle history:', error);
      toast({
        title: 'Error clearing battle history',
        description: 'Some battles may not have been deleted. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Refresh the battle list to show current state
      fetchBattles();
    } finally {
      setIsClearing(false);
      setIsOpen(false);
    }
  };

  if (loading) {
    return <Text>Loading battle history...</Text>;
  }

  return (
    <Box maxW="1200px" mx="auto" px={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Battle History</Heading>
        {battles.length > 0 && (
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setIsOpen(true)}
            size="sm"
            isDisabled={isClearing}
          >
            {isClearing ? 'Clearing...' : 'Clear History'}
          </Button>
        )}
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Clear Battle History
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This will permanently delete all battle records.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)} isDisabled={isClearing}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={clearHistory} 
                ml={3}
                isLoading={isClearing}
                loadingText="Clearing..."
              >
                Clear History
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {battles.length === 0 ? (
        <Text textAlign="center" fontSize="xl">
          No battles recorded yet. Start battling to see your history!
        </Text>
      ) : (
        <Accordion allowMultiple>
          {battles.map((battle) => (
            <AccordionItem key={battle.id} bg="whiteAlpha.200" mb={4} borderRadius="lg">
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text fontSize="lg" fontWeight="bold">
                    {battle.pokemon1} vs {battle.pokemon2}
                  </Text>
                  <Text fontSize="sm" color="gray.300">
                    {new Date(battle.timestamp).toLocaleString()}
                  </Text>
                </Box>
                <Badge
                  colorScheme={battle.winner === battle.pokemon1 ? "green" : "red"}
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="full"
                  mr={4}
                >
                  {battle.winner} wins!
                </Badge>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                {battle.battleDetails ? (
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th color="gray.300">Stat</Th>
                        <Th color="gray.300" isNumeric>{battle.pokemon1}</Th>
                        <Th color="gray.300" isNumeric>{battle.pokemon2}</Th>
                        <Th color="gray.300">Winner</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {battle.battleDetails.map((detail, index) => (
                        <Tr key={index}>
                          <Td color="white" textTransform="capitalize">{detail.stat}</Td>
                          <Td color="white" isNumeric>{detail.pokemon1Value}</Td>
                          <Td color="white" isNumeric>{detail.pokemon2Value}</Td>
                          <Td>
                            <Badge
                              colorScheme={detail.winner === battle.winner ? "green" : "yellow"}
                              variant="subtle"
                            >
                              {detail.winner}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  <Text color="gray.300">No detailed stats available for this battle.</Text>
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Box>
  );
};

export default BattleHistory; 