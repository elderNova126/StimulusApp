import { useLazyQuery } from '@apollo/client';
import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TenantQueries from '../../../graphql/Queries/TenantQueries';
import { getLastWeekDate } from '../../../utils/date';
import { exportCsv } from '../../../utils/file';
import EventsList from '../../EventsList/EventsList';
import LogFilters from './LogFilters';
import { forwardRef } from 'react';
import { Company } from '../company.types';
import StimButton from '../../ReusableComponents/Button';
const { ACTIVITY_LOG_GQL } = TenantQueries;

export interface EventFilter {
  companyId?: string;
  userId?: string;
  projectId?: string;
  timestampFrom?: any;
  timestampTo?: any;
}
const ActivityLog = forwardRef((props: { company: Company }, ref) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { company } = props;

  const { t } = useTranslation();
  const [eventFilters, setEventFilters] = useState<EventFilter>({
    timestampFrom: getLastWeekDate(),
    timestampTo: new Date(),
    companyId: company?.id,
  });
  const [history, setHistory] = useState([]);
  const [getLogs, { data, loading }] = useLazyQuery(ACTIVITY_LOG_GQL, {
    fetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const lastThree = data?.searchEvents.results ? data?.searchEvents.results.slice(0, 3) : [];
      setHistory(lastThree);
    },
  });
  useEffect(() => {
    getLogs({
      variables: {
        ...eventFilters,
        companyId: company?.id,
      },
    });
  }, [eventFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = (data: EventFilter) => {
    setEventFilters(data);
  };

  const lastLoginDate = localStorage.getItem('lastLoginDate');

  return (
    <Stack id="activityLog" maxW="1200px">
      <Flex justifyContent="space-between" alignItems="flex-end">
        <Text as="h1" textStyle="h1_profile">
          {t('Activity Log')}
        </Text>
      </Flex>
      <Tabs size="xs" isLazy index={tabIndex} onChange={(index: number) => setTabIndex(index)}>
        <TabList borderBottom="1px solid #E9E9E9" borderColor="#E9E9E9" display="flex" justifyContent="flex-end">
          <Box>
            <Text fontWeight="400" fontSize="14px" lineHeight="38px" textStyle="horizontalTabs">
              {'Last Logged on ' + lastLoginDate}
            </Text>
          </Box>
          <Text marginLeft="15px" textStyle="horizontalTabs" fontSize="22px" lineHeight="26px">
            {' '}
            .{' '}
          </Text>
          <Box>
            {tabIndex === 0 && (
              <>
                <StimButton onClick={() => exportCsv(history)} variant="stimTextButton" borderRadius="28px" maxH="34px">
                  {t('Export')}
                </StimButton>
                <LogFilters count={data?.searchEvents?.results?.length} applyFilters={applyFilters} />
              </>
            )}
          </Box>
        </TabList>
        <TabPanels>
          <TabPanel className="activity_log_tab">
            <EventsList notifications={history} loading={loading} variant={'DIVIDEDLIST'} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
});

export default ActivityLog;
