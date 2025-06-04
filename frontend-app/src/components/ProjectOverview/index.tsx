import { useQuery } from '@apollo/client';
import { Box, Divider, Flex, HStack, Skeleton, Text } from '@chakra-ui/react';
import { Link } from '@reach/router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PartialProject } from '../../graphql/dto.interface';
import { ProjectStatus } from '../../graphql/enums';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { getCompanyName } from '../../utils/dataMapper';
import { utcStringToLocalDate, utcStringToLocalDateTime } from '../../utils/date';
import { localeUSDFormat } from '../../utils/number';
import { activitylogComponents } from '../ProjectActivityLog/ProjectMessages';
import SimpleNote from '../ProjectNotesTab/SimpleNote';
import { navigate } from '@reach/router';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
interface Props {
  project: PartialProject;
  users: any[];
  projectId: number;
  isLoading: boolean;
}

interface CustomFieldViewProps {
  label: string;
  projectId?: number;
  value: any;
  width?: string;
  loading: boolean;
  clickable?: boolean;
}

const { PROJECT_NOTES_GQL, PROJECT_ACTIVITY_LOG_GQL } = ProjectQueries;

const CustomFieldView: FC<CustomFieldViewProps> = ({ label, value, width, loading, clickable, projectId }) => (
  <Flex flexDirection="column" width={width}>
    <Text mt="2rem" mb="1rem" as="h5" textStyle="h5" color="#000000">
      {label}
    </Text>
    <Text
      as="h2"
      textStyle="h2"
      {...(clickable === true && { cursor: 'pointer', _hover: { textDecoration: 'underline' } })}
      onClick={() => {
        if (clickable) {
          navigate(`/project/${projectId}`);
        }
      }}
    >
      <Skeleton startColor="green.100" endColor="green.400" isLoaded={!loading}>
        {value || '-'}
      </Skeleton>
    </Text>
  </Flex>
);

const ProjectOverview: FC<Props> = ({ project, users, projectId, isLoading }) => {
  const { t } = useTranslation();
  const projectOwners = users.filter((user) => user.userType === 'owner');
  const awardedCompanies = project?.projectCompany?.filter?.((comp: any) => comp.type === 'AWARDED') ?? [];

  const projectNotStarted = project?.status
    ? [ProjectStatus.NEW, ProjectStatus.OPEN, ProjectStatus.INREVIEW].indexOf(project?.status) > -1
    : false;
  const projectNotCompleted = project?.status !== ProjectStatus.COMPLETED;
  const { data: notes } = useQuery(PROJECT_NOTES_GQL(projectId, 2), {
    fetchPolicy: 'cache-and-network',
  });

  const { data: activities } = useQuery(PROJECT_ACTIVITY_LOG_GQL, {
    variables: { projectId, direction: 'DESC', limit: 2 },
    fetchPolicy: 'cache-and-network',
  });
  const latestActivity = activities?.projectActivityLog?.results ?? [];

  const latestNotes = notes?.projectNotes?.results ?? [];

  const projectDescription = project?.description || t('No description...') || '';
  const { parentProjectTreeId, treeProjectId } = project;
  return (
    <Box pr="8rem">
      <CustomFieldView loading={isLoading} label={t('Budget')} value={localeUSDFormat(project?.budget || 0)} />
      <CustomFieldView loading={isLoading} label={t('Description')} value={projectDescription} />
      <Divider mt="40px" mb="10px" />
      <HStack spacing="4rem">
        <CustomFieldView
          loading={isLoading}
          width="200px"
          label={t('Project ID / Contract Number')}
          value={project?.contract}
        />
        <CustomFieldView
          loading={isLoading}
          width="200px"
          label={t('Project Owner')}
          value={projectOwners.map(({ id }) => (
            <Text textDecoration="underline" key={id}>
              Administrator
            </Text>
          ))}
        />
        <CustomFieldView loading={isLoading} width="200px" label={t('Parent Project Id')} value={parentProjectTreeId} />
        <CustomFieldView
          loading={isLoading}
          width="200px"
          label={t('Id to create sub projects')}
          value={treeProjectId}
        />
      </HStack>
      <HStack spacing="4rem">
        <CustomFieldView
          loading={isLoading}
          width="200px"
          label={t('Created Date')}
          value={utcStringToLocalDate(project?.created)}
        />
        <CustomFieldView
          loading={isLoading}
          width="200px"
          label={t('Start Date')}
          value={utcStringToLocalDate(projectNotStarted ? project?.expectedStartDate : project?.startDate)}
        />
        <CustomFieldView
          loading={isLoading}
          width="200px"
          label={t('End Date')}
          value={utcStringToLocalDate(projectNotCompleted ? project?.expectedEndDate : project?.endDate)}
        />
        <CustomFieldView
          loading={isLoading}
          label={t('Suppliers Awarded')}
          value={
            awardedCompanies.length > 0 ? (
              awardedCompanies?.map?.(({ company }: any) => (
                <Link
                  to={`/company/${company?.id}`}
                  key={company?.id}
                  style={{ textDecoration: 'underline', display: 'block' }}
                >
                  {getCompanyName(company)}
                </Link>
              ))
            ) : (
              <Text>{t('-')}</Text>
            )
          }
        />
      </HStack>
      <HStack spacing="4rem">
        {project?.continuationOfProject?.title && (
          <CustomFieldView
            loading={isLoading}
            width="200px"
            label={t('Continued From')}
            clickable={true}
            projectId={project?.continuationOfProject.id}
            value={project?.continuationOfProject.title}
          />
        )}
        {project?.isContinuedByProject?.title && (
          <CustomFieldView
            loading={isLoading}
            width="200px"
            label={t('Continued By')}
            clickable={true}
            projectId={project?.isContinuedByProject.id}
            value={project?.isContinuedByProject.title}
          />
        )}
      </HStack>
      <Text mt="2rem" mb="1rem" as="h5" textStyle="h5" color="#000000">
        {t('Latest Activity')}
      </Text>
      {isLoading ? (
        <Skeleton height="50px" startColor="green.100" endColor="green.400" />
      ) : (
        latestActivity?.map((activityLog: any) => {
          const Component = activitylogComponents[activityLog.code];
          return (
            <Box as="span" key={activityLog.id}>
              {Component && <Component activityLog={activityLog} />}
              <Text mb="1rem" mt=".4rem" fontSize="12px">
                {t('Changed on ')}
                {`${utcStringToLocalDateTime(activityLog.created) || ''}`}
                {t(' by ')}
                <span>{activityLog.userName || ''}</span>
              </Text>
            </Box>
          );
        })
      )}
      <Text mt="2rem" mb="1rem" as="h5" textStyle="h5" color="#000000">
        {t('Latest Notes')}
      </Text>
      {isLoading ? (
        <Skeleton height="50px" startColor="green.100" endColor="green.400" />
      ) : (
        latestNotes?.map((note: any) => <SimpleNote projectId={project?.id} key={note.id} note={note} />)
      )}
    </Box>
  );
};

export default withLDConsumer()(ProjectOverview) as any;
