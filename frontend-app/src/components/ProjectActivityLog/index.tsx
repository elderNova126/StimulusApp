import { useQuery } from '@apollo/client';
import { Box, Flex, Image } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { utcStringToLocalDateTime } from '../../utils/date';
import { EventCode } from '../NotificationPopup';
import { activitylogComponents } from './ProjectMessages';
import LoadingScreen from '../LoadingScreen';

const { PROJECT_ACTIVITY_LOG_GQL } = ProjectQueries;

const ProjectActivityLog = (props: { projectId: number }) => {
  const { t } = useTranslation();
  const { projectId } = props;
  const { data, loading } = useQuery(PROJECT_ACTIVITY_LOG_GQL, { variables: { projectId, direction: 'DESC' } });
  const events = data?.projectActivityLog?.results || [];
  return (
    <Box padding="0rem 8rem 2rem 0rem">
      {loading ? (
        <LoadingScreen />
      ) : (
        events?.map((activityLog: any) => {
          const Component = activitylogComponents[activityLog.code];
          return (
            <Flex marginTop="2rem" key={activityLog} flexDirection="row">
              <Image mt="6px" mr="2" w="20px" h="18px" src="/icons/edit_icon.svg" />
              <Box>
                {Component && <Component activityLog={activityLog} />}
                <Flex flexDirection="row" mb="1rem" mt=".4rem" fontSize="12px">
                  {t('Changed on ')}
                  {`${utcStringToLocalDateTime(activityLog.created) || ''}`}
                  {t(' by ')}
                  <Box
                    marginLeft="3px"
                    fontSize="12px"
                    textDecoration="underline"
                    textColor={activityLog.code !== EventCode.EVALUATE_PROJECT_COMPANY ? 'green' : ''}
                  >
                    {activityLog.userName || ''}
                  </Box>
                </Flex>
              </Box>
            </Flex>
          );
        })
      )}
    </Box>
  );
};

export default ProjectActivityLog;
