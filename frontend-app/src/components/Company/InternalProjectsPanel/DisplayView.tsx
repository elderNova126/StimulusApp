import { useQuery } from '@apollo/client';
import { ArrowUpDownIcon } from '@chakra-ui/icons';
import { Box, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { FC, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectStatus } from '../../../graphql/enums';
import UserQueries from '../../../graphql/Queries/UserQueries';
import { InternalProject, ProjectEvaluation } from '../../../graphql/types';
import { utcStringToLocalDate } from '../../../utils/date';
import { localeUSDFormat } from '../../../utils/number';
import { MetricValue } from '../ScorePanel/MetricValue';
import { useUser } from '../../../hooks';
import MessageComponent from '../../GenericComponents/MessageComponent';
import { navigate } from '@reach/router';
import LoadingScreen from '../../LoadingScreen';

const { TENANT_MY_USERS_GQL } = UserQueries;

export const DisplayView: FC<{ projects: InternalProject[]; loading: boolean; setcount: (() => void) | any }> = (
  props
) => {
  const { projects, loading, setcount } = props;
  const { t } = useTranslation();
  const [internalProjects, setInternalProjects] = useState(projects);
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
  const defaultFilter = [...projects].filter((project) => {
    const type = project.projectCompany.map((supplier: any) => supplier.type);
    return project.status === ProjectStatus.COMPLETED && project.deleted === false && type[0] === 'AWARDED';
  });

  const toastIdRef: any = useRef();
  const toast = useToast();
  const closeToast = () => {
    toast.close(toastIdRef.current);
  };

  const defaultSort = [...defaultFilter].sort((a, b) => {
    const valueA: any = new Date(a.endDate);
    const valueB: any = new Date(b.endDate);
    const valueNullA: any = a.endDate === null;
    const valueNullB: any = b.endDate === null;
    return order === false ? valueNullA - valueNullB || +(valueA > valueB) || -(valueA < valueB) : valueB - valueA;
  });

  useEffect(() => {
    setInternalProjects(defaultSort);
    setcount(defaultSort.length);
    setSortType('endDate');
  }, [projects]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sortArray = (type: any) => {
      switch (type) {
        case 'targetScore':
          return setInternalProjects(
            [...internalProjects].sort((a, b) => {
              const valueA: number = a.targetScore ?? 0;
              const valueB: number = b.targetScore ?? 0;
              return order === false ? valueA - valueB : valueB - valueA;
            })
          );
        case 'startDate':
          return setInternalProjects(
            [...internalProjects].sort((a, b) => {
              const valueA: any = new Date(a.startDate);
              const valueB: any = new Date(b.startDate);
              return order === false ? valueA - valueB : valueB - valueA;
            })
          );
        case 'endDate':
          return setInternalProjects(defaultSort);
        case 'budget':
          return setInternalProjects(
            [...internalProjects].sort((a: any, b: any) => {
              const valueA: number = a.budget as number;
              const valueB: number = b.budget as number;
              return order === false ? valueA - valueB : valueB - valueA;
            })
          );
        case 'title':
          return setInternalProjects(
            [...internalProjects].sort((a, b) => {
              return order === false ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
            })
          );
        default:
          return internalProjects;
      }
    };
    sortArray(sortType);
  }, [sortType, order]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (firstSort) {
      setOrder(true);
      setFirstSort(false);
    } else {
      setOrder(false);
    }
  }, [sortType]); // eslint-disable-line react-hooks/exhaustive-deps

  const GetBudgetSpendByScoreProject = (project: InternalProject) => {
    const { projectCompany } = project;
    const evaluatios = projectCompany[0]?.evaluations ?? [];
    const evaluatio = evaluatios?.filter(
      (evaluation: ProjectEvaluation) => evaluation.scoreValue === project.scoreProject
    );
    return evaluatio[0]?.budgetSpend;
  };

  const handleOnClick = (project: InternalProject) => {
    const { collaborations } = project;
    const isCollaborator =
      collaborations.filter((collaboration: any) => collaboration.userId === myAccount.id).length > 0;

    if (isCollaborator) {
      navigate(`/project/${project.id}`);
    } else {
      const message = <span>{t('You are not a collaborator of this project.')}</span>;
      toastIdRef.current = toast({
        render: () => <MessageComponent message={message} close={closeToast} />,
      });
    }
  };
  return (
    <Box maxH="200px" overflowY="scroll" id="internalProjects">
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
                {t('TITLE')}
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
            <Th borderColor="#D5D5D5">
              <Text textStyle="h5" cursor={'pointer'} _hover={{ textDecoration: 'underline' }}>
                {t('TIER')}
              </Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {internalProjects.length === 0 && !loading && <Text marginTop="20px">{t('No projects found')}</Text>}
          {loading ? (
            <LoadingScreen />
          ) : (
            internalProjects.map((project) => (
              <Tr key={project.id}>
                <Td borderColor="#D5D5D5">
                  <Text as="h4" textStyle="h4" onClick={() => handleOnClick(project)} cursor={'pointer'}>
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
                  <Text textStyle="tableSubInfoSecondary">
                    {localeUSDFormat(GetBudgetSpendByScoreProject(project)) + ' USD'}
                  </Text>
                </Td>
                <Td borderColor="#D5D5D5">
                  <MetricValue label={t('')} value={project.scoreProject ?? '-'} />
                </Td>
                <Td borderColor="#D5D5D5">
                  {!!project.projectCompany[0].company?.tenantCompanyRelation?.supplierTier && (
                    <>
                      <Stack marginLeft={'-15px'} direction="row" marginTop={'-10px'}>
                        <Text fontWeight={400} fontSize="15px" bg="#E9F8ED" p="4px 10px" borderRadius="15px">
                          {`Tier ${project.projectCompany[0].company?.tenantCompanyRelation?.supplierTier}` ?? '-'}
                        </Text>
                      </Stack>
                    </>
                  )}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
