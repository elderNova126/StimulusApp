import React from 'react';
import { HStack, Text } from '@chakra-ui/react';

interface BetaProps {
  width?: string;
  height?: string;
  fontSize?: string;
}

const Beta: React.FC<BetaProps> = ({ width = '30px', height = '15px', fontSize = '10px' }) => {
  return (
    <HStack bg="#11b2bc" borderRadius="md" w={width} h={height} justify="center" m="0px 2px">
      <Text color="white" p="3px 10px" fontWeight="600" fontSize={fontSize}>
        Beta
      </Text>
    </HStack>
  );
};

export default Beta;
