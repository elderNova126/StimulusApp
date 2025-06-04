import { Stack, Text, Box } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { useTranslation } from 'react-i18next';
import StimButton from '../../ReusableComponents/Button';
const NoResultsProjects = () => {
  const { t } = useTranslation();
  return (
    <Stack p="3" bg="#E9F8ED" h="100%">
      <Text p="5" fontSize="16px">
        {t('There are no recent projects available at the moment.')}
      </Text>
      <Box p="1rem">
        <StimButton onClick={() => navigate('/projects/create')} size="stimSmall">
          {t('Create a New Project')}
        </StimButton>
      </Box>
    </Stack>
  );
};
export default NoResultsProjects;
