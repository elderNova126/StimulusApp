import { useQuery } from '@apollo/client';
import { ArrowUpDownIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { FC, forwardRef, useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyProjectType, ProjectStatus } from '../../../graphql/enums';
import ProjectQueries from '../../../graphql/Queries/ProjectQueries';
import UserQueries from '../../../graphql/Queries/UserQueries';
import { InternalProject } from '../../../graphql/types';
import { utcStringToLocalDate } from '../../../utils/date';
import { localeUSDFormat } from '../../../utils/number';
import { CustomTooltip } from '../../GenericComponents/CustomTooltip';
import { styleNumber, styleNumberOfResults } from '../commonStyles';
import { Company } from '../company.types';
import { MetricValue } from '../ScorePanel/MetricValue';
import { CompanyProfileDivider } from '../shared';
import { useUser } from '../../../hooks';
import MessageComponent from '../../GenericComponents/MessageComponent';
import { navigate } from '@reach/router';
import { TableProjectsNamesIndex, TableProjectsNames } from './ProjectPanel.const';
import { defaultProjectSort, sortProjectArray, GetBudgetSpend, GetScoreProject } from './ProjectPanelLogic';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
import { calculateRemainingDays, getExpirationDays } from '../../../utils/companies/expirationInfo';
import CompanyAttachments, { CompanyAttachmentTypes } from '../AttachmentsPanel/CompanyAttachments';
import LoadingScreen from '../../LoadingScreen';
const { GET_PROJECTS_BY_COMPANY, GET__SUPPLIER_TIER_ROJECTS_BY_COMPANY } = ProjectQueries;
const { TENANT_MY_USERS_GQL } = UserQueries;

const ProjectsPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company } = props;
  const { data } = useQuery(GET_PROJECTS_BY_COMPANY, {
    variables: {
      companyId: company.id,
      companyType: CompanyProjectType.AWARDED,
      statusIn: [ProjectStatus.COMPLETED],
      orderBy: 'project.created',
      direction: 'DESC',
    },
    fetchPolicy: 'cache-and-network',
  });
  const projects = data?.searchProjects?.results ?? [];

  const projectsWithRemainingDays = useMemo(() => {
    return projects.map((project: InternalProject) => {
      if (project.endDate) {
        const remainingDays = calculateRemainingDays(project.endDate);
        return { ...project, remainingDays };
      }
      return { ...project, remainingDays: null };
    });
  }, [projects]);

  const { data: suppTierProejcts, loading: suppTierloading } = useQuery(GET__SUPPLIER_TIER_ROJECTS_BY_COMPANY, {
    variables: {
      companyId: company.id,
      companyType: CompanyProjectType.AWARDED,
      statusIn: [ProjectStatus.COMPLETED],
      orderBy: 'project.created',
      direction: 'DESC',
    },
    fetchPolicy: 'cache-and-network',
  });
  const projectsTier = suppTierProejcts?.searchSupplierTierProjects?.results ?? [];

  const projectsTierWithRemainingDays = useMemo(() => {
    return projectsTier.map((project: InternalProject) => {
      if (project.endDate) {
        const remainingDays = calculateRemainingDays(project.endDate);
        return { ...project, remainingDays };
      }
      return { ...project, remainingDays: null };
    });
  }, [projectsTier]);

  const globalLoading = suppTierloading; // || otherLoading;
  const displays = [projectsWithRemainingDays, projectsTierWithRemainingDays]; // [projects, projectsTier, projectsOther];
  const { t } = useTranslation();

  return (
    <Stack id="projects">
      <Stack direction="column" spacing={4}>
        <Stack direction="row">
          <Flex>
            <Text as="h1" textStyle="h1_profile" marginRight="1.5">
              {t('Projects')}
            </Text>
          </Flex>
        </Stack>
        <CompanyProfileDivider />
        <Stack spacing={20}>
          {displays.map((display, index) => {
            return display?.length ? (
              <Stack spacing={0}>
                <Stack direction="column" spacing={4}>
                  <Stack direction="row">
                    <Flex>
                      <Text as="h1" textStyle="h1_profile" marginRight="1.5">
                        {t(TableProjectsNamesIndex()[index] ?? 'More projects')}
                      </Text>
                      {index === 0 && (
                        <CustomTooltip label={'Projects that are completed with your organization.'}>
                          <Box lineHeight="2rem">
                            <InfoOutlineIcon color="gray" />
                          </Box>
                        </CustomTooltip>
                      )}
                      {display.length > 0 && (
                        <Flex sx={styleNumberOfResults} marginTop="-2.5%">
                          <Text sx={styleNumber}>{display.length}</Text>
                        </Flex>
                      )}
                    </Flex>
                  </Stack>
                  <CompanyProfileDivider />
                </Stack>
                <DisplayView projects={display} loading={globalLoading} index={index} />
              </Stack>
            ) : null;
          })}
        </Stack>
        <Box my="10px !important" data-testid="project-attachment">
          <Text as="h5" textStyle="h5" mb="1">
            {t('Attachments')}
          </Text>
          <CompanyAttachments company={company} type={CompanyAttachmentTypes.PROJECT} />
        </Box>
      </Stack>
    </Stack>
  );
});
export const DisplayView: FC<{ projects: InternalProject[]; loading: boolean; index: number }> = (props) => {
  const { projects, loading, index } = props;
  const { t } = useTranslation();
  const [Projects, setProjects] = useState(projects);
  const [sortType, setSortType] = useState<string>('endDate');
  const [order, setOrder] = useState<boolean>(true);
  const [firstSort, setFirstSort] = useState<boolean>(true);

  const {
    user: { sub },
  } = useUser();
  const { data: userData } = useQuery(TENANT_MY_USERS_GQL, {
    variables: {
      externalAuthSystemId: sub,
    },
    fetchPolicy: 'cache-first',
  });
  const myAccount = userData?.tenantMyUsers[0];
  const toastIdRef: any = useRef();
  const toast = useToast();
  const closeToast = () => {
    toast.close(toastIdRef.current);
  };
  const defaultSort = defaultProjectSort(projects, order);

  useEffect(() => {
    setProjects(defaultSort);
    setSortType('endDate');
  }, [projects]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    sortProjectArray({
      type: sortType,
      Projects,
      setProjects,
      order,
      defaultSort,
    });
  }, [sortType, order]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (firstSort) {
      setOrder(true);
      setFirstSort(false);
    } else {
      setOrder(false);
    }
  }, [sortType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOnClick = (project: InternalProject) => {
    if (index !== 0) return null;

    const { collaborations, archived } = project;
    const isCollaborator = collaborations
      ? collaborations.filter((collaboration: any) => collaboration.userId === myAccount?.id).length > 0
      : false;
    if (isCollaborator || archived) {
      navigate(`/project/${project.id}`);
    } else {
      const message = <span>{t('You are not a collaborator of this project.')}</span>;
      toastIdRef.current = toast({
        render: () => <MessageComponent message={message} close={closeToast} />,
      });
    }
  };
  return (
    <Box maxH="200px" overflowY="scroll">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th
              borderColor="#D5D5D5"
              onClick={() => {
                setSortType('title');
                setOrder(!order);
              }}
            >
              <Text textStyle="h5" cursor={'pointer'} _hover={{ textDecoration: 'underline' }}>
                {t(
                  TableProjectsNamesIndex()[index] === TableProjectsNames.OTHER_PROJECTS ? 'CUSTOMER INDUSTRY' : 'TITLE'
                )}
                <ArrowUpDownIcon
                  fontSize="10px"
                  marginLeft="10px"
                  marginBottom="3px"
                  visibility={sortType === 'title' ? 'visible' : 'hidden'}
                />
              </Text>
            </Th>
            <Th
              borderColor="#D5D5D5"
              onClick={() => {
                setSortType('startDate');
                setOrder(!order);
              }}
            >
              <Text textStyle="h5" cursor={'pointer'} _hover={{ textDecoration: 'underline' }}>
                {t('START')}
                <ArrowUpDownIcon
                  fontSize="10px"
                  marginLeft="10px"
                  marginBottom="3px"
                  visibility={sortType === 'startDate' ? 'visible' : 'hidden'}
                />
              </Text>
            </Th>
            <Th
              borderColor="#D5D5D5"
              onClick={() => {
                setSortType('endDate');
                setOrder(!order);
              }}
            >
              <Text textStyle="h5" cursor={'pointer'} _hover={{ textDecoration: 'underline' }}>
                {t('END')}
                <ArrowUpDownIcon
                  fontSize="10px"
                  marginLeft="10px"
                  marginBottom="3px"
                  visibility={sortType === 'endDate' ? 'visible' : 'hidden'}
                />
              </Text>
            </Th>
            <Th
              borderColor="#D5D5D5"
              onClick={() => {
                setSortType('budget');
                setOrder(!order);
              }}
            >
              <Text textStyle="h5" cursor={'pointer'} _hover={{ textDecoration: 'underline' }}>
                {t('AMOUNT SPENT')}
                <ArrowUpDownIcon
                  fontSize="10px"
                  marginLeft="10px"
                  marginBottom="3px"
                  visibility={sortType === 'budget' ? 'visible' : 'hidden'}
                />
              </Text>
            </Th>
            <Th
              borderColor="#D5D5D5"
              onClick={() => {
                setSortType('targetScore');
                setOrder(!order);
              }}
            >
              <Text textStyle="h5" cursor={'pointer'} _hover={{ textDecoration: 'underline' }}>
                {t('PERFORMANCE')}
                <ArrowUpDownIcon
                  fontSize="10px"
                  marginLeft="10px"
                  marginBottom="3px"
                  visibility={sortType === 'targetScore' ? 'visible' : 'hidden'}
                />
              </Text>
            </Th>
            <Th
              borderColor="#D5D5D5"
              onClick={() => {
                setSortType('remainingDays');
                setOrder(!order);
              }}
            >
              <Text textStyle="h5" cursor={'pointer'} _hover={{ textDecoration: 'underline' }}>
                {t('EXPIRES IN')}
                <ArrowUpDownIcon
                  fontSize="10px"
                  marginLeft="10px"
                  marginBottom="3px"
                  visibility={sortType === 'remainingDays' ? 'visible' : 'hidden'}
                />
              </Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {Projects.length === 0 && !loading && <Text marginTop="20px">{t('No projects found')}</Text>}
          {loading ? (
            <LoadingScreen />
          ) : (
            Projects?.map((project) => (
              <Tr key={project.id}>
                <Td borderColor="#D5D5D5">
                  <Text
                    as="h4"
                    textStyle="h4"
                    onClick={() => handleOnClick(project)}
                    cursor={index !== 0 ? 'default' : 'pointer'}
                  >
                    {project.title}
                  </Text>
                </Td>
                <Td borderColor="#D5D5D5">
                  <Text textStyle="tableSubInfoSecondary">
                    {project.startDate ? utcStringToLocalDate(project.startDate) : '-'}
                  </Text>
                </Td>
                <Td borderColor="#D5D5D5">
                  <Text textStyle="tableSubInfoSecondary">
                    {project.endDate ? utcStringToLocalDate(project.endDate) : '-'}
                  </Text>
                </Td>
                <Td borderColor="#D5D5D5">
                  <Text textStyle="tableSubInfoSecondary">{localeUSDFormat(GetBudgetSpend(project)) + ' USD'}</Text>
                </Td>
                <Td borderColor="#D5D5D5">
                  <MetricValue label={t('')} value={GetScoreProject(project) ?? '-'} />
                </Td>
                <Td borderColor="#D5D5D5">
                  <Text
                    textStyle="tableSubInfoSecondary"
                    color={project.remainingDays && project.remainingDays < 90 ? 'red' : 'black'}
                  >
                    {project.remainingDays ? getExpirationDays(project.remainingDays) : '-'}
                  </Text>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default withLDConsumer()(ProjectsPanel) as any;
