import { useQuery } from '@apollo/client';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { getCompanyName } from '../../utils/dataMapper';
import { CompanyAvatar } from '../GenericComponents';
import { BiRightArrowAlt } from 'react-icons/bi';
import { EventLog } from './types';
import LogItem from './LogItem';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import LoadingScreen from '../LoadingScreen';
const { GET_COMPANY_NAME } = CompanyQueries;

const CompanyLog: FC<{ entityId: string; events: EventLog[]; variant: 0 | 1; dashboard?: boolean }> = (props) => {
  const { events, entityId, variant, dashboard } = props;
  const { data, loading } = useQuery(GET_COMPANY_NAME, {
    variables: { id: entityId },
    fetchPolicy: 'cache-first',
  });
  const { t } = useTranslation();
  const company = data?.searchCompanies?.results?.[0];

  if (!loading && !company) {
    return null;
  }
  return (
    <Flex alignItems="flex-start" w="100%" {...(dashboard && { ml: '-3px' })}>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <Box p="2">{company && <CompanyAvatar size="xs" companyId={company.id} />}</Box>
          <Stack flex="1" spacing={3} p="2" ml="-10px">
            <Stack spacing={0} mt="2px" mb={dashboard ? '-10px' : ''}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                onClick={() => navigate(`/company/${company.id}`)}
                cursor="pointer"
              >
                <Text as="h4" textStyle="h4">
                  {getCompanyName(company)}
                </Text>
                {!dashboard && <BiRightArrowAlt fontSize="24px" />}
              </Stack>
              {!dashboard && <Text textStyle="filterFieldHeading">{t('Company')}</Text>}
            </Stack>
            {events.map((event: EventLog) => (
              <LogItem key={event.id} event={event} variant={variant} dashboard={dashboard} />
            ))}
          </Stack>
        </>
      )}
    </Flex>
  );
};

export default CompanyLog;
