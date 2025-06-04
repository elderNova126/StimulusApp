import { Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
const NoResultsTenantActivity = () => {
  const { t } = useTranslation();
  return (
    <Stack p="3" bg="#E9F8ED" h="100%">
      <Text p="5" fontSize="16px">
        {t('There is no team activity at this moment.')}
      </Text>
    </Stack>
  );
};
export default NoResultsTenantActivity;
