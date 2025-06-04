import { Box, Flex } from '@chakra-ui/layout';
import { RouteComponentProps } from '@reach/router';
import { FC } from 'react';

const MyTenantLayout: FC<RouteComponentProps> = (props) => {
  return (
    <Flex>
      <Box w="100%" p="7rem 0 0 0rem">
        {props.children}
      </Box>
    </Flex>
  );
};

export default MyTenantLayout;
