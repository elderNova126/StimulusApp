import { useQuery } from '@apollo/client';
import { Box, Center, Flex, HStack, Skeleton, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PartialProject } from '../../graphql/dto.interface';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { capitalizeFirstLetter } from '../../utils/dataMapper';
import { CompanyType } from '../Company/company.types';
import { useDispatch, useSelector } from 'react-redux';
import { ProjectsState, setFalseHasNewEvaluation } from '../../stores/features/projects';
import CustomTab from '../GenericComponents/CustomTab';
import NotFound from '../NotFound';
import ProjectActivityLog from '../ProjectActivityLog';
import ProjectDetails from '../ProjectDetails';
import ProjectEvaluations from '../ProjectEvaluations';
import ProjectNotesTab from '../ProjectNotesTab';
import ProjectOptions from '../ProjectOptions';
import ProjectOverview from '../ProjectOverview';
import ProjectPeopleTab from '../ProjectPeopleTab';
import ProjectSelectionCriteria from '../ProjectSelectionCriteria';
import ProjectSuppliersTab from '../ProjectSuppliersTab';
import ProjectStepper from './ProjectStepper';

export enum ProjectStatus {
  NEW = 'NEW',
  OPEN = 'OPEN',
  INREVIEW = 'INREVIEW',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

const { SEARCH_SUPPLIERS, SEARCH_PROJECT_COMPANIES, PROJECT_DETAILS_GQL, PROJECT_COLLABORATORS } = ProjectQueries;

interface Params {
  projectId?: any;
}

const Project = (props: RouteComponentProps & Params) => {
  let { projectId } = props;
  const dispatch = useDispatch();
  const newEvaluation = useSelector((state: { projects: ProjectsState }) => state.projects?.hasNewEvaluation);
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  projectId = parseInt(projectId, 10);
  const {
    loading: loadingProject,
    data: projectDetails,
    refetch: refetchProjectDetails,
  } = useQuery(PROJECT_DETAILS_GQL(projectId), {
    fetchPolicy: 'cache-and-network',
  });
  const { loading: loadingCollaborators, data: invitations } = useQuery(PROJECT_COLLABORATORS, {
    variables: { projectId },
    fetchPolicy: 'cache-and-network',
  });
  const { loading: loadingSuppliers, data: supplierData } = useQuery(SEARCH_SUPPLIERS, {
    variables: { projectId },
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: searchProjectCompaniesData,
    loading: loadingSearchProjectCompaniesData,
    refetch,
  } = useQuery(SEARCH_PROJECT_COMPANIES, {
    variables: { projectId, companyType: CompanyType.Awarded },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (newEvaluation === true) {
      refetchProjectDetails();
      dispatch(setFalseHasNewEvaluation());
    }
  }, [newEvaluation]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    refetch();
  }, [supplierData]); // eslint-disable-line react-hooks/exhaustive-deps

  const collaborators =
    invitations?.searchProjectCollaborations?.results
      ?.filter((invitation: any) => invitation?.status === 'accept')
      ?.map(({ id, userType, user }: any) => ({
        ...user,
        userType,
        collaborationId: id,
        collaborationType: capitalizeFirstLetter(userType ?? ''),
      })) ?? [];

  const pendingCollaborators =
    invitations?.searchProjectCollaborations?.results
      ?.filter((invitation: any) => invitation?.status === 'pending')
      ?.map(({ user }: any) => user) ?? [];

  const suppliers = supplierData?.searchProjectCompanies?.results ?? [];
  const project: PartialProject = projectDetails?.searchProjects?.results?.[0] ?? {};
  const projectWithSuppliers = { ...project, projectCompany: suppliers };

  if (isNaN(projectId)) {
    return <NotFound />;
  }

  if (!loadingProject) {
    if (!project) {
      return <NotFound />;
    }
  }

  const showEvaluation = [ProjectStatus.INPROGRESS, ProjectStatus.COMPLETED].indexOf(project?.status as any) > -1;

  return (
    <Box p="7rem 7rem 0 4rem">
      <Text mr=".5rem" as="h6" textStyle="h6" pb="2rem" color="#000">
        {t('Projects')}
      </Text>
      <Flex flexDirection="row" width="auto" marginBlockEnd="2.5%" marginBlockStart="-1%">
        <Box flex="auto" display="contents">
          {loadingProject ? (
            <Skeleton width={'600px'} height="48px" startColor="green.100" endColor="green.400" />
          ) : (
            <Text fontSize="34px" mr=".5rem" textStyle="h1" pb="2rem" maxWidth="420px">
              {project?.title}
            </Text>
          )}
          <Box>{!loadingProject && <ProjectOptions collaborators={collaborators || {}} project={project || {}} />}</Box>
          {project?.status === ProjectStatus.CANCELED && (
            <Center
              w="auto"
              h="25px"
              boxShadow={`5px 2px 2px red`}
              bg="red"
              borderRadius="10%"
              border="1px solid red"
              marginLeft={'1%'}
            >
              <Text textStyle="body" color="#fff" fontWeight="600" margin="0.5">
                {t('Canceled')}
              </Text>
            </Center>
          )}
          {project?.archived && (
            <Center
              w="auto"
              h="25px"
              boxShadow={`5px 2px 2px #11b2bc`}
              bg="#11b2bc"
              borderRadius="10%"
              border="1px solid #11b2bc"
              marginLeft={'1%'}
            >
              <Text textStyle="body" color="#fff" fontWeight="600" margin="0.5">
                {t('Archived')}
              </Text>
            </Center>
          )}
        </Box>
        <Box flex="auto" marginLeft={'15%'}>
          {loadingProject ? (
            <Skeleton width={'500px'} height="48px" startColor="green.100" endColor="green.400" />
          ) : (
            <ProjectStepper
              evaluations={searchProjectCompaniesData?.searchProjectCompanies?.results ?? []}
              project={projectWithSuppliers}
              activeStep={(() => {
                const index = Object.keys(ProjectStatus).indexOf(project?.status);
                return index === Object.keys(ProjectStatus).length - 1 ? -1 : index;
              })()}
              steps={[
                ProjectStatus.NEW,
                ProjectStatus.OPEN,
                ProjectStatus.INREVIEW,
                ProjectStatus.INPROGRESS,
                ProjectStatus.COMPLETED,
              ]}
            />
          )}
        </Box>
      </Flex>
      <Tabs isLazy index={tabIndex} onChange={(index: number) => setTabIndex(index)}>
        <TabList borderBottom="1px solid #E9E9E9" borderColor="#E9E9E9">
          <HStack spacing="2rem">
            <CustomTab p="0">
              <Text textStyle="horizontalTabs">{t('Overview')}</Text>
            </CustomTab>
            <CustomTab p="0">
              <Text textStyle="horizontalTabs">{t('Details')}</Text>
            </CustomTab>
            <CustomTab p="0">
              <Text textStyle="horizontalTabs">{t('Suppliers')}</Text>
            </CustomTab>
            <CustomTab p="0">
              <Text textStyle="horizontalTabs">{t('Selection Criteria')}</Text>
            </CustomTab>
            <CustomTab p="0">
              <Text textStyle="horizontalTabs">{t('People')}</Text>
            </CustomTab>
            <CustomTab p="0">
              <Text textStyle="horizontalTabs">{t('Notes')}</Text>
            </CustomTab>
            <CustomTab p="0">
              <Text textStyle="horizontalTabs">{t('Activity Log')}</Text>
            </CustomTab>
            {showEvaluation && (
              <CustomTab p="0">
                <Text textStyle="horizontalTabs">{t('Evaluations')}</Text>
              </CustomTab>
            )}
          </HStack>
        </TabList>
        <TabPanels>
          <TabPanel p="0" pt="10px">
            <ProjectOverview
              projectId={parseInt(projectId, 10)}
              isLoading={loadingProject}
              project={projectWithSuppliers}
              users={collaborators}
            />
          </TabPanel>
          <TabPanel p="0">
            <ProjectDetails isLoading={loadingProject} project={projectWithSuppliers} users={collaborators} />
          </TabPanel>
          <TabPanel p="0">
            <ProjectSuppliersTab
              isLoading={!projectWithSuppliers.projectCompany?.length && loadingSuppliers}
              project={projectWithSuppliers}
            />
          </TabPanel>
          <TabPanel p="0">
            <ProjectSelectionCriteria project={projectWithSuppliers} />
          </TabPanel>
          <TabPanel p="0">
            <ProjectPeopleTab
              collaborators={collaborators}
              pendingCollaborators={pendingCollaborators}
              loading={loadingCollaborators}
              projectId={projectId}
            />
          </TabPanel>
          <TabPanel p="0">
            <ProjectNotesTab projectId={projectId} />
          </TabPanel>
          <TabPanel p="0">
            <ProjectActivityLog projectId={projectId} />
          </TabPanel>
          <TabPanel p="0">
            <ProjectEvaluations
              projectId={projectId}
              searchProjectCompaniesData={searchProjectCompaniesData}
              loading={loadingSearchProjectCompaniesData}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Project;
