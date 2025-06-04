import { Box, Divider, Flex } from '@chakra-ui/react';
import { Image } from '@chakra-ui/image';
import { navigate } from '@reach/router';
import StimText from '../ReusableComponents/Text';

const SmallMenu = (props: { setMenuOpen: (val: boolean) => void; open: boolean }) => {
  const { setMenuOpen, open } = props;

  return (
    <Box
      bg="linear-gradient(360deg, rgba(249, 254, 251, 0) 0%, rgba(249, 254, 251, 0.8) 100%)"
      height="100%"
      w="100%"
      px="8px"
      {...(!open && { maxWidth: '104px' })}
    >
      <Flex justifyContent="center" alignItems="center">
        <Image
          src="/icons/stimulus_short.svg"
          alt="stimulus_logo"
          aria-label="home"
          onClick={() => {
            return navigate('/dashboard');
          }}
          cursor="pointer"
          mt="1rem"
          w="17px"
          h="38px"
        />
      </Flex>
      <StimText
        variant="stimSmallCaption"
        onClick={() => {
          navigate('/dashboard');
          return setMenuOpen(true);
        }}
        aria-label="home"
        py="10px"
        px="4px"
        cursor="pointer"
        mt="2rem"
        data-testid="small-menu-dashboard"
      >
        DASHBOARD
      </StimText>
      <Divider my="0.2rem" />
      <StimText
        variant="stimSmallCaption"
        data-cy="all-companies-page"
        onClick={() => {
          navigate('/companies/all/list/1');
          return setMenuOpen(true);
        }}
        aria-label="companies"
        py="10px"
        px="4px"
        cursor="pointer"
        data-testid="small-menu-companies"
      >
        COMPANIES
      </StimText>
      <Divider my="0.2rem" />
      <StimText
        variant="stimSmallCaption"
        onClick={() => {
          navigate('/projects/1');
          return setMenuOpen(true);
        }}
        aria-label="projects"
        py="10px"
        px="4px"
        cursor="pointer"
        data-testid="small-menu-projects"
        data-cy="small-menu-projects"
      >
        PROJECTS
      </StimText>
      <Divider my="0.2rem" />
      <StimText
        variant="stimSmallCaption"
        onClick={() => {
          navigate('/pbreport');
          return setMenuOpen(true);
        }}
        aria-label="reports"
        py="10px"
        px="4px"
        cursor="pointer"
        data-testid="small-menu-reports"
      >
        REPORTS
      </StimText>
    </Box>
  );
};

export default SmallMenu;
