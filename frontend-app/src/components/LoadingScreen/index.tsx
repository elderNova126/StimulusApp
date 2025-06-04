import { Image, Flex, Box } from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';

function LoadingScreen(props: RouteComponentProps) {
  return (
    <Flex justifyContent="center" alignItems="center" position="relative" data-testid="loading-screen">
      <Box
        justifyContent="center"
        alignItems="center"
        position="relative"
        h="491px"
        w="600px"
        bgImage="url('https://stimulusmetricsdev.blob.core.windows.net/images/4pmgif.gif')"
        bgSize="cover"
        bgPosition="center"
      >
        <Image
          h="312px"
          w="219px"
          src="https://stimulusmetricsdev.blob.core.windows.net/images/human.png"
          position="absolute"
          bottom="-3"
          left="0"
          alt="human"
        />
      </Box>
    </Flex>
  );
}

export default LoadingScreen;
