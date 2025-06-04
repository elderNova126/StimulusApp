import { useQuery } from '@apollo/client';
import { Box, Flex, Image, Skeleton, Stack, Text } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BiRightArrowAlt } from 'react-icons/bi';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import LogItem from './LogItem';
import { EventLog } from './types';

const { GET_PROJECT_NAME } = ProjectQueries;

const ProjectLog: FC<{ entityId: string; events: EventLog[]; variant: 0 | 1; dashboard?: boolean }> = (props) => {
  const { events, entityId, variant, dashboard } = props;
  const { data, loading } = useQuery(GET_PROJECT_NAME, {
    variables: { id: parseInt(entityId, 10) },
    fetchPolicy: 'cache-first',
  });
  const project = data?.searchProjects?.results?.[0] || {};
  const { t } = useTranslation();
  if (!loading && !project) {
    return null;
  }
  return (
    <Flex alignItems="flex-start" w="100%" overflow={'scroll'}>
      {loading ? (
        <Skeleton height="30px" startColor="green.100" endColor="green.400" />
      ) : (
        <>
          <Box p="2">{<Image w="20px" src="/icons/suitcase_log.svg" />}</Box>
          <Stack flex="1" spacing={3} p="2" ml="-10px">
            <Stack spacing={0} mt="-1px" mb={dashboard ? '-10px' : ''}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                onClick={() => navigate(`/project/${project.id}`)}
                cursor="pointer"
              >
                <Text as="h4" textStyle="h4">
                  {project.title}
                </Text>
                {!dashboard && <BiRightArrowAlt fontSize="24px" />}
              </Stack>
              {!dashboard && <Text textStyle="filterFieldHeading">{t('Project')}</Text>}
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

export default ProjectLog;
