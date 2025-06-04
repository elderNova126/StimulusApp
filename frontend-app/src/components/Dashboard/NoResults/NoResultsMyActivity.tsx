import { Box, Stack, Text } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { useTranslation } from 'react-i18next';
import StimButton from '../../ReusableComponents/Button';
const NoResultsMyActivity = () => {
  const { t } = useTranslation();

  return (
    <Stack p="3" bg="#E9F8ED" h="100%">
      <Text p="5" fontSize="14px">
        {t('Start interacting with the Stimulus platform and the latest activities will be shown here.')}
      </Text>
      <Box p="1rem">
        <StimButton onClick={() => navigate('/companies/all/list/1')} size="stimSmall">
          {t('View Companies')}
        </StimButton>
      </Box>
    </Stack>
  );
};
export default NoResultsMyActivity;
