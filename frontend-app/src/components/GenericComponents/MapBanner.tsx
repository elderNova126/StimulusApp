import { Box, Image, Stack, Text, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const MapBanner = () => {
  const { t } = useTranslation();

  const BoxStyle = {
    bg: 'linear-gradient(179.97deg, rgba(176, 226, 187, 0.25) 0.03%, rgba(146, 214, 193, 0.75) 99.97%), #FFFFFF;',
    borderRadius: '5px',
    marginBottom: '10px',
    width: '95%',
    h: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: '#4caf50',
  };

  return (
    <Stack sx={BoxStyle}>
      <Box>
        <Center>
          <Text as="h2" textStyle="h2" pb="1rem" marginTop={'15%'} fontSize="24px">
            {t('No Results Found')}
          </Text>
        </Center>
        <Center>
          <Text as="h3" textStyle="h3" pb="2rem" color="#2A2A28" fontSize="18px">
            {t('Sorry! Please try again using different search criteria.')}
          </Text>
        </Center>
      </Box>
      <Box>
        <Center justifyContent="end" marginRight="2%" marginTop="8rem">
          <Image src={'/icons/no_results_map.svg'} minW="45%" />
        </Center>
      </Box>
    </Stack>
  );
};

export default MapBanner;
