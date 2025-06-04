import { useTranslation } from 'react-i18next';
import ProjectDetailsAttachments from '../ProjectDetailsAttachments';
import { localeUSDFormat } from '../../utils/number';
import { utcStringToLocalDate } from '../../utils/date';
import { Box, Divider, Flex, Stack, Text } from '@chakra-ui/layout';
import { FC } from 'react';
import { Skeleton } from '@chakra-ui/skeleton';
import { ProjectStatus } from '../../graphql/enums';

interface CustomFieldViewProps {
  label: string;
  value: any;
  width?: string;
  loading: boolean;
}
const CustomFieldView: FC<CustomFieldViewProps> = ({ label, value, width, loading }) => (
  <Box flex="1">
    <Flex flexDirection="column" width={width}>
      <Text mt="2rem" mb="1rem" as="h5" textStyle="h5" color="#000000">
        {label}
      </Text>
      <Text as="h2" textStyle="h2">
        <Skeleton startColor="green.100" endColor="green.400" isLoaded={!loading}>
          {value || '-'}
        </Skeleton>
      </Text>
    </Flex>
  </Box>
);

const ProjectDetails = (props: { project: any; users: any[]; isLoading: boolean }) => {
  const { t } = useTranslation();
  const { project, users, isLoading } = props;
  const projectOwners = users.filter((user) => user.userType === 'owner');
  const projectNotStarted =
    [ProjectStatus.NEW, ProjectStatus.OPEN, ProjectStatus.INREVIEW].indexOf(project.status) > -1;
  const projectNotCompleted = project.status !== ProjectStatus.COMPLETED;
  return (
    <Box data-testid="projectDetails" p="1rem 8rem 0 0">
      <Stack spacing={4}>
        <Flex w="66%">
          <CustomFieldView label={t('Project Id/Contract No')} value={project.contract} loading={isLoading} />
          <CustomFieldView
            label={t('Project Owner')}
            value={projectOwners.map(() => `Administrator`)}
            loading={isLoading}
          />
        </Flex>
        <Divider />

        <Flex>
          <CustomFieldView
            label={t('Created Date')}
            value={utcStringToLocalDate(project.created)}
            loading={isLoading}
          />
          <CustomFieldView
            label={(projectNotStarted ? t('Expected ') : '') + t('Start Date')}
            value={utcStringToLocalDate(projectNotStarted ? project.expectedStartDate : project.startDate)}
            loading={isLoading}
          />
          <CustomFieldView
            label={(projectNotCompleted ? t('Expected ') : '') + t('End Date')}
            value={utcStringToLocalDate(projectNotCompleted ? project.expectedEndDate : project.endDate)}
            loading={isLoading}
          />
        </Flex>
        <Divider />

        <Flex>
          <CustomFieldView label={t('Budget')} value={localeUSDFormat(project.budget)} loading={isLoading} />
        </Flex>
        <Divider />

        <Flex>
          <CustomFieldView label={t('Description')} value={project.description} loading={isLoading} />
        </Flex>
        <Flex>
          <CustomFieldView label={t('Keywords')} value={project.keywords} loading={isLoading} />
        </Flex>
        <Flex data-testid="project-attachments">
          {project.id && <ProjectDetailsAttachments projectId={project.id} />}
        </Flex>
      </Stack>
    </Box>
  );
};

export default ProjectDetails;
