import { useLazyQuery } from '@apollo/client';
import { Box, Select, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertQueries from '../../graphql/Queries/NotificationQueries';
import EventsList from '../EventsList/EventsList';
import { Pagination } from '../GenericComponents';

const { NOTIFICATIONS_GQL } = AlertQueries;

const Notifications: FC<RouteComponentProps> = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [getNotifications, { loading, data }]: any = useLazyQuery(NOTIFICATIONS_GQL, {
    fetchPolicy: 'cache-and-network',
  });
  const notifications = data?.notifications?.results?.map?.((notification: any) => notification.event) ?? [];

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    getNotifications({
      variables: {
        ...(filter === 'company' && { companiesOnly: true }),
        ...(filter === 'project' && { projectsOnly: true }),
        page,
        limit,
      },
    });
  }, [page, limit, filter, getNotifications]);

  return (
    <Box w="95%" p="7rem 0 0 4rem">
      <Text as="h1" textStyle="h1" pb="2rem">
        {t('Notifications')}
      </Text>
      <Tabs colorScheme="green">
        <TabList>
          <Tab>{t('New')}</Tab>
          <Tab>{t('Archive')}</Tab>
          <Box position="absolute" right="3rem">
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} variant="simple">
              <option value="">{t('All categories')}</option>
              <option value="company">{t('Companies')}</option>
              <option value="project">{t('Projects')}</option>
            </Select>
          </Box>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Stack direction="row-reverse">
              <Pagination
                page={page}
                loading={loading}
                count={data?.notifications?.count ?? 0}
                rowsPerPageOptions={[5, 10, 50, 100]}
                onChangePage={setPage}
                onChangeRowsPerPage={setLimit}
                rowsPerPage={limit}
              />
            </Stack>
            <Box w="100%">
              <EventsList notifications={notifications} loading={loading} variant={'SIMPLELISTO'} />
            </Box>
          </TabPanel>
          <TabPanel>
            <p>archived notifications!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Notifications;
