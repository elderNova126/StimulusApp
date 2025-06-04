import { useLazyQuery } from '@apollo/client';
import { Box, Center, Divider, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { CollaborationStatus } from '../../graphql/enums';
import { useUser } from '../../hooks';
import ProjectsPendingAccess from './List';
import useStyles from './style';

const { PROJECTS_ACCESS_PENDING } = ProjectQueries;

const ProjectsPendingContainer = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const accessPageHook = useState<number>(1);
  const accessLimitHook = useState<number>(2);
  const [titleSearch, setTitleSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [accessPage, setAccessPage] = accessPageHook;
  const [accessLimit, setAccessLimit] = accessLimitHook;
  const [searchPendingAccessProjects, { loading: accessPendingLoading, data: pendingAccessProjects, variables }] =
    useLazyQuery(PROJECTS_ACCESS_PENDING, { fetchPolicy: 'cache-and-network' });

  const {
    user: { sub: currentUserId },
  } = useUser();

  useEffect(() => {
    setAccessPage(1);
  }, [accessLimit]);
  useEffect(() => {
    setAccessPage(1);
    setAccessLimit(accessLimit);
  }, [startDate, endDate, titleSearch]);

  useEffect(() => {
    searchPendingAccessProjects({
      variables: {
        userId: currentUserId,
        page: accessPage,
        limit: accessLimit,
        status: CollaborationStatus.PENDING,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(titleSearch && { title: titleSearch }),
      },
    });
  }, [accessPage, titleSearch, accessLimit, currentUserId, startDate, endDate, searchPendingAccessProjects]);

  return (
    <Flex flexWrap="wrap" w="100%" data-testid="projectsPending-container" pt="1.5rem">
      <Box minW="70%">
        <ProjectsPendingAccess
          data={pendingAccessProjects}
          loading={accessPendingLoading}
          pageHook={accessPageHook}
          limitHook={accessLimitHook}
          variables={variables}
        />
      </Box>
      <Stack spacing={2}>
        <Box>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchPendingAccessProjects({
                variables: {
                  ...variables,
                  ...(titleSearch && { title: titleSearch }),
                },
              });
            }}
          >
            <label>
              <Stack spacing={2}>
                <Text as="h3" textStyle="h3">
                  {t('Search')}
                </Text>
                <Input
                  data-testid="title-search"
                  name="title"
                  className={classes.input}
                  variant="outlined"
                  value={titleSearch}
                  placeholder={t('by project name')}
                  onChange={(e) => setTitleSearch(e.target.value)}
                />
              </Stack>
            </label>
          </form>
        </Box>
        <Stack spacing={2}>
          <Text as="h3" textStyle="h3">
            {t('Filter by Date')}
          </Text>
          <Divider />
          <Input
            value={startDate}
            type="date"
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            bg="#fff"
            size="sm"
            borderRadius="4px"
            flex="1"
            border="1px solid #848484"
            placeholder="Start"
          />
          <Center>
            {' '}
            <Text textStyle="body">{t('to')}</Text>
          </Center>
          <Input
            value={endDate}
            type="date"
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            bg="#fff"
            size="sm"
            borderRadius="4px"
            flex="1"
            border="1px solid #848484"
            placeholder="End"
          />
        </Stack>
      </Stack>
    </Flex>
  );
};

export default ProjectsPendingContainer;
