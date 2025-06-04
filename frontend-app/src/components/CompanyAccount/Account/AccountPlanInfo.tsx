import { useQuery } from '@apollo/client';
import { Box, Center, Divider, Flex, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import UserQueries from '../../../graphql/Queries/UserQueries';
import LoadingScreen from '../../LoadingScreen';
const { ACCOUNT_INFO, USER_ACCOUNT } = UserQueries;

const AccountPlanInfo = () => {
  const { t } = useTranslation();
  const { loading, data } = useQuery(ACCOUNT_INFO, { fetchPolicy: 'cache-first' });
  const { data: userAccount } = useQuery(USER_ACCOUNT, { fetchPolicy: 'cache-first' });

  const planInfo = data?.accountInfo;
  let tier = '';

  switch (userAccount?.userAccount?.stimulusPlan) {
    case 'standard':
      tier = t('Standard');
      break;
    case 'premium':
      tier = t('Premium');
      break;
    case 'premium_plus':
      tier = t('Premium Plus');
      break;
    default:
      break;
  }

  return (
    <Center>
      <Stack justifyContent="center" data-testid="accountPlanInfo" w="80%">
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <Box>
              <Text as="h2" textStyle="h2">
                {t('Account Info')}
              </Text>
            </Box>
            <Box>
              <Divider />
            </Box>
            <Stack spacing={2}>
              <Box>
                <Text textStyle="body">{t('Subscription Type')}</Text>
              </Box>
              <Box>
                <Text>{tier}</Text>
              </Box>
              <Box>
                <Divider />
              </Box>
              <Box>
                <Flex justifyContent="space-between">
                  <Text textStyle="body">{t('Active')}</Text>
                  <Text textStyle="body">{planInfo?.active ?? t('N/A')}</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textStyle="body">{t('Inactive')}</Text>
                  <Text textStyle="body">{planInfo?.inactive ?? t('N/A')}</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textStyle="body">{t('TOTAL')}</Text>
                  <Text textStyle="body">{planInfo?.total ?? t('N/A')}</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textStyle="body">{t('Archived')}</Text>
                  <Text textStyle="body">{planInfo?.archived ?? t('N/A')}</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textStyle="body">{t('Converted from External')}</Text>
                  <Text textStyle="body">{planInfo?.convertedFromExternal ?? t('N/A')}</Text>
                </Flex>
              </Box>
            </Stack>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default AccountPlanInfo;
