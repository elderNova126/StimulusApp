import { useLazyQuery } from '@apollo/client';
import { Box, Divider, Flex, List, ListItem, Text } from '@chakra-ui/react';
import { navigate, useLocation, useParams } from '@reach/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { PartialProject } from '../../graphql/dto.interface';
import { useStimulusToast, useUser } from '../../hooks';
import { setLimitProjects } from '../../stores/features/generalData';
import { ProjectsState } from '../../stores/features/projects';
import { Pagination } from '../GenericComponents';
import ProjectsListFilters, { ProjectStatuses } from '../ProjectsFilters';
import LoadingScreen from '../LoadingScreen';
const { PROJECTS_GQL } = ProjectQueries;

const ProjectsList = () => {
  const dispatch = useDispatch();
  const [searchAllProjects, { loading, data }] = useLazyQuery(PROJECTS_GQL, { fetchPolicy: 'cache-and-network' });

  const { enqueueSnackbar } = useStimulusToast();
  const params = useParams();
  const location = useLocation();
  const pathname = location.pathname.replace(/\d.*/g, "$'");
  const limitList = useSelector((state: any) => state.generalData.limit.projects);
  const { t } = useTranslation();
  const [page, setPage] = useState(Number(params?.page));
  const [limit, setLimit] = useState(limitList);
  const searchByTitle: string = useSelector((state: { projects: ProjectsState }) => state.projects?.searchByTitle);
  const searchByStatuses: string[] = useSelector(
    (state: { projects: ProjectsState }) => state.projects?.searchByStatuses
  );
  const {
    user: { sub: userId },
  } = useUser();

  const searchArchived: boolean = useSelector((state: { projects: ProjectsState }) => state.projects?.searchArchived);
  const searchNotArchived: boolean = useSelector(
    (state: { projects: ProjectsState }) => state.projects?.searchNotArchived
  );
  const searchStartDate: string = useSelector((state: { projects: ProjectsState }) => state.projects?.searchStartDate);
  const searchEndDate: string = useSelector((state: { projects: ProjectsState }) => state.projects?.searchEndDate);
  const searchAccessType: string = useSelector(
    (state: { projects: ProjectsState }) => state.projects?.searchAccessType
  );

  useEffect(() => {
    dispatch(setLimitProjects(limit));
  }, [limit]);

  useEffect(() => {
    setPage(Number(params.page));
  }, [params]);

  const triggerSearchProjects = useCallback(() => {
    let archived;
    if (searchArchived && !searchNotArchived) {
      archived = undefined;
    } else if (searchArchived) {
      archived = true;
    } else if (!searchNotArchived) {
      archived = false;
    }

    searchAllProjects({
      variables: {
        userId,
        page,
        limit,
        ...(searchByTitle && { title: searchByTitle }),
        ...(searchByStatuses && { statusIn: searchByStatuses }),
        ...(searchNotArchived && { archived: searchArchived }),
        archived,
        ...(searchAccessType && { accessType: searchAccessType }),
        ...(searchStartDate && { expectedStartDate: searchStartDate }),
        ...(searchEndDate && { endDate: searchEndDate }),
      },
    });
  }, [
    // eslint-disable-line react-hooks/exhaustive-deps
    limit,
    page,
    searchAccessType,
    searchArchived,
    searchByStatuses,
    searchByTitle,
    searchNotArchived,
    searchAllProjects,
    searchStartDate,
    searchEndDate,
    userId,
  ]);

  useEffect(() => {
    triggerSearchProjects();
  }, [
    // eslint-disable-line react-hooks/exhaustive-deps
    page,
    limit,
    searchByStatuses,
    searchNotArchived,
    searchArchived,
    searchAccessType,
    searchStartDate,
    searchEndDate,
  ]);

  useEffect(() => {
    if (data?.searchAllProjects?.error) {
      enqueueSnackbar(t('There was an error while fetching data'), { status: 'error' });
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex w="100%">
      <Box w="70%">
        <List spacing={1} mt="1em">
          {!data?.searchAllProjects ? (
            <LoadingScreen />
          ) : data.searchAllProjects?.results ? (
            data.searchAllProjects?.results?.map((result: PartialProject) => (
              <Box key={result.id}>
                <ListItem
                  p="3"
                  _hover={{ bg: '#F6F6F6' }}
                  display="flex"
                  flexDir="column"
                  w="100%"
                  as="button"
                  onClick={() => navigate(`/project/${result.id}`)}
                >
                  <Text as="h2" textStyle="h2" textAlign={'left'}>
                    {result.title}
                  </Text>
                  <Text as="h6" textStyle="h6" color="#000" textAlign={'left'}>
                    {ProjectStatuses[result.status] === 'INPROGRESS'
                      ? 'In-Progress'
                      : ProjectStatuses[result.status] === 'INREVIEW'
                        ? 'Review'
                        : ProjectStatuses[result.status]}
                  </Text>
                </ListItem>
                <Divider />
              </Box>
            ))
          ) : (
            <div>{`${t('No results found')}...`}</div>
          )}
        </List>
        <Pagination
          pathname={pathname}
          page={page}
          loading={loading}
          count={data?.searchAllProjects?.count ?? 0}
          rowsPerPageOptions={[2, 5, 10]}
          onChangePage={setPage}
          onChangeRowsPerPage={setLimit}
          rowsPerPage={limit}
        />
      </Box>
      <ProjectsListFilters
        triggerSearchProjects={triggerSearchProjects}
        title={searchByTitle}
        statuses={searchByStatuses}
        archived={searchArchived}
        notArchived={searchNotArchived}
        startDate={searchStartDate}
        endDate={searchEndDate}
        accessType={searchAccessType}
      />
    </Flex>
  );
};

export default ProjectsList;
