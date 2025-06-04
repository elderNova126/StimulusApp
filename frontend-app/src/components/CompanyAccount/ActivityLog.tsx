import { useLazyQuery } from '@apollo/client';
import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { Popover, PopoverBody, PopoverContent, PopoverFooter, PopoverTrigger } from '@chakra-ui/popover';
import { TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import { RouteComponentProps } from '@reach/router';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TenantQueries from '../../graphql/Queries/TenantQueries';
import { exportCsv } from '../../utils/file';
import EventsList from '../EventsList/EventsList';
import { CustomDatePicker } from '../GenericComponents';
import { ProjectSelectAutocomplete, UserSelectAutocomplete } from '../GenericComponents/Select';
import StimButton from '../ReusableComponents/Button';

const { ACTIVITY_LOG_GQL } = TenantQueries;

const getLastWeekDate = () => {
  const today = new Date();
  const lastweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  return lastweek;
};

interface EventFilter {
  companyId?: string;
  userId?: string;
  projectId?: string;
  timestampFrom?: any;
  timestampTo?: any;
}
const CompanyActivityLog: FC<RouteComponentProps> = (props) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();
  const [eventFilters, setEventFilters] = useState<EventFilter>({
    timestampFrom: getLastWeekDate(),
    timestampTo: new Date(),
  });
  const [getLogs, { data, loading }] = useLazyQuery(ACTIVITY_LOG_GQL, {
    fetchPolicy: 'cache-first',
  });
  const notifications = useMemo(() => data?.searchEvents?.results ?? [], [data]);
  useEffect(() => {
    getLogs({ variables: eventFilters });
  }, [eventFilters, getLogs]);

  const applyFilters = (data: EventFilter) => {
    setEventFilters(data);
  };

  const lastLoginDate = localStorage.getItem('lastLoginDate');
  return (
    <Stack w="95%">
      <Flex justifyContent="space-between" alignItems="flex-end">
        <Text as="h1" textStyle="h1">
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
                <StimButton onClick={() => exportCsv(notifications)} variant={'stimTextButton'} maxH="34px">
                  {t('Export')}
                </StimButton>
                <LogFilters count={data?.searchEvents?.results?.length} applyFilters={applyFilters} />
              </>
            )}
          </Box>
        </TabList>
        <TabPanels>
          <TabPanel>
            <EventsList notifications={notifications} loading={loading} variant={'DIVIDEDLIST'} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

const LogFilters: FC<{ applyFilters: (data: EventFilter) => void; count: number }> = (props) => {
  const { applyFilters, count } = props;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(getLastWeekDate);
  const [endDate, setEndDate] = useState(new Date());

  const resetFilters = () => {
    setProjectFilter(null);
    setUserId(null);
    setCompanyId(null);
    applyFilters({
      timestampFrom: startDate,
      timestampTo: endDate,
    });
  };

  return (
    <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <StimButton onClick={() => setIsOpen(true)} variant={isOpen ? 'stimPrimary' : 'stimTextButton'} maxH="34px">
          {t('Filters')}
        </StimButton>
      </PopoverTrigger>
      <Box zIndex="100">
        <PopoverContent
          bg="#FCFCFC"
          mr="5"
          width="auto"
          borderRadius="0"
          border="1px solid #E4E4E4"
          borderColor="#E4E4E4"
          boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
        >
          <PopoverBody bg="#F8F8F8" p="1.5rem" w="320px">
            <Stack alignItems="flex-start">
              <Stack spacing={1}>
                <Text as="h4" textStyle="h4">
                  {t('Date')}
                </Text>
                <Stack direction="row" spacing={2}>
                  <Stack spacing={0}>
                    <Text textStyle="body">{t('Start')}</Text>
                    <DateField setDate={setStartDate} date={startDate} />
                  </Stack>
                  <Stack spacing={0}>
                    <Text textStyle="body">{t('End')}</Text>
                    <DateField setDate={setEndDate} date={endDate} />
                  </Stack>
                </Stack>
              </Stack>
              <Stack spacing={1}>
                <Text as="h4" textStyle="h4">
                  {t('Project')}
                </Text>
                <ProjectSelectAutocomplete setProjectId={setProjectFilter} projectId={projectFilter} />
              </Stack>

              {/*
              TODO: REFACTOR
              <Stack spacing={1}>
                <Text as="h4" textStyle="h4">
                  {t('Company')}
                </Text>
                <CompanySelectAutocomplete setCompanyId={setCompanyId} companyId={companyId} />
              </Stack> */}

              <Stack spacing={1}>
                <Text as="h4" textStyle="h4">
                  {t('Users')}
                </Text>
                <UserSelectAutocomplete setUserId={setUserId} userId={userId} />
              </Stack>

              <StimButton onClick={resetFilters} variant="stimTextButton" p="0px !important">
                {t('Reset Filters')}
              </StimButton>
            </Stack>
          </PopoverBody>
          <PopoverFooter boxShadow="stimMedium" h="47px">
            <Flex flex="1" direction="row-reverse" alignItems="flex-start">
              <StimButton
                onClick={() => {
                  applyFilters({
                    timestampFrom: startDate,
                    timestampTo: endDate,
                    ...(!!companyId && { companyId }),
                    ...(!!userId && { userId }),
                    ...(!!projectFilter && { projectId: projectFilter as any }),
                  });
                  setIsOpen(false);
                }}
                colorScheme="green"
                variant="stimOutline"
                bg="white"
                size="stimSmall"
              >
                <Text textStyle="squareSolidActive">
                  {`${t('Apply filters')} (${
                    [startDate, endDate, companyId, projectFilter, userId].filter((i) => i).length
                  })`}
                </Text>
              </StimButton>
              {count && (
                <Text fontWeight="600" marginRight="18px" marginTop="6px" fontSize="12px">
                  {count + ' Results'}
                </Text>
              )}
            </Flex>
          </PopoverFooter>
        </PopoverContent>
      </Box>
    </Popover>
  );
};

const DateField: FC<{ date: Date; setDate: (date: Date) => void }> = (props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { date, setDate } = props;

  return (
    <Flex
      zIndex={'modal'}
      _focus={{ border: '1px solid blue', borderRadius: '4px' }}
      position="relative"
      onClick={() => (open ? null : setOpen(true))}
      flexDirection="row"
    >
      {/* minDate={minDate}  */}
      <CustomDatePicker
        open={open}
        setDate={(date) => {
          setDate(date);
          setOpen(false);
        }}
        date={date}
        placeholder="MM/DD/YYY"
      />
    </Flex>
  );
};

export default CompanyActivityLog;
