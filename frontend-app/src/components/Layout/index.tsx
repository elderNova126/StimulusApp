import { Flex, Box, useMediaQuery } from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';
import { FC } from 'react';
import LeftMenu from './LeftMenu';

const Layout: FC<RouteComponentProps> = (props) => {
  const pathname = props.location?.pathname;
  const [, category, viewId, listId] = pathname?.split('/') ?? [];
  const [isLargerThan1400] = useMediaQuery('(min-width: 1400px)');

  const menuOpen = ['companies', 'projects', ''].indexOf(category) > -1 && isLargerThan1400;

  return (
    <Flex>
      <Box minHeight="100vh">
        <LeftMenu defaultOpen={menuOpen} category={category} viewId={viewId === 'lists' ? listId : viewId} />
      </Box>
      <Box flex={1}>{props.children}</Box>
    </Flex>
  );
};

export default Layout;
