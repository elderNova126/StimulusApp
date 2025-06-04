import { Box, Flex, Image, Heading, Text } from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';

function Maintenance(props: RouteComponentProps) {
  return (
    <Flex h="100vh" overflow="hidden" data-testid="maintenance-container">
      <Box
        w="50vw"
        h="100vh"
        bg="#E9F8ED"
        p={{ base: '2rem', md: '8rem' }}
        display="flex"
        flexDirection="column"
        justifyContent="start"
        data-testid="left-section"
      >
        <Image src="/stimuluslogo.png" alt="Stimulus Logo" w="150px" />
        <Heading fontSize={{ base: '24px', md: '36px' }} fontWeight="500" mt="4rem">
          Application is Currently Unavailable
        </Heading>
        <Text fontSize={{ base: '16px', md: '18px' }} fontWeight="400" mt="1rem">
          Stimulus is currently under maintenance. We should be back shortly.
        </Text>
        <Text fontSize={{ base: '16px', md: '18px' }} fontWeight="400" mt="1rem">
          Thank you for your patience.
        </Text>
      </Box>

      <Box w="50vw" h="100vh" p={{ base: '2rem', md: '8rem' }} position="relative" data-testid="right-section">
        <Image
          src="/icons/background_charts.svg"
          alt="Background Chart"
          position="absolute"
          top="9rem"
          left="50%"
          transform="translateX(-50%)"
          w={{ base: '80%', md: '40vw' }}
        />
        <Image
          src="/icons/human.svg"
          alt="Person Sitting"
          position="relative"
          mt={{ base: '8rem', md: '13rem' }}
          ml={{ base: '1rem', md: '2rem' }}
          w={{ base: '40%', md: '15vw' }}
        />
      </Box>
    </Flex>
  );
}

export default Maintenance;
