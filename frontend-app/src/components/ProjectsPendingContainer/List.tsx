import { useMutation } from '@apollo/client';
import { Box, Divider, List, ListItem, Stack, Text } from '@chakra-ui/layout';
import * as R from 'ramda';
import { useTranslation } from 'react-i18next';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { useStimulusToast } from '../../hooks';
import { Pagination } from '../GenericComponents';
import LoadingScreen from '../LoadingScreen';
import StimButton from '../ReusableComponents/Button';

const { PROJECTS_ACCESS_PENDING } = ProjectQueries;
const { REJECT_PROJECT_INVITATION, ACCEPT_PROJECT_INVITATION } = ProjectMutations;
interface PendingInvitation {
  id: string;
  status: string;
  project: {
    id: string;
    title: string;
    status: string;
  };
}
const ProjectsPendingAccess = (props: {
  loading: boolean;
  data: any;
  pageHook: any[];
  limitHook: any[];
  variables: any;
}) => {
  const [page, setPage] = props.pageHook;
  const [limit, setLimit] = props.limitHook;
  const { t } = useTranslation();
  const { loading, data, variables } = props;
  const { enqueueSnackbar } = useStimulusToast();
  const removeItemFromCache = (cache: any, id: string) => {
    const { searchUserCollaborations } = R.clone(cache.readQuery({ query: PROJECTS_ACCESS_PENDING, variables })) as any;
    searchUserCollaborations.results = searchUserCollaborations.results?.filter(
      (collaboration: any) => collaboration.id !== id
    );

    cache.writeQuery({
      query: PROJECTS_ACCESS_PENDING,
      variables,
      data: {
        searchUserCollaborations: {
          ...searchUserCollaborations,
          count: searchUserCollaborations?.count - 1 ?? 0,
        },
      },
    });
  };

  const [acceptCollaborationInvite, { loading: loadingAccept }] = useMutation(ACCEPT_PROJECT_INVITATION, {
    update: (cache, { data: { acceptCollaboration } }) => {
      if (acceptCollaboration.status === 'accept') {
        enqueueSnackbar(t('Invitation accepted'), { status: 'success' });
        removeItemFromCache(cache, acceptCollaboration.id);
      }
    },
  });

  const [rejectCollaborationInvite, { loading: loadingReject }] = useMutation(REJECT_PROJECT_INVITATION, {
    update: (cache, { data: { rejectCollaboration } }) => {
      if (rejectCollaboration.status === 'rejected') {
        enqueueSnackbar(t('Invitation rejected'), { status: 'success' });
        removeItemFromCache(cache, rejectCollaboration.id);
      }
    },
  });

  const pendingItems: PendingInvitation[] = (data?.searchUserCollaborations?.results || []).filter(
    ({ status }: any) => status === 'pending'
  );

  const performAction = (data: { id: string; accept: boolean }) => {
    const { accept, id } = data;
    if (accept) {
      acceptCollaborationInvite({ variables: { id: `${id}` } });
    } else {
      rejectCollaborationInvite({ variables: { id: `${id}` } });
    }
  };

  return (
    <Stack spacing={4} w="90%" data-testid="projects-pending-access">
      <Text as="h4" textStyle="h4">
        {`${data?.searchUserCollaborations?.count ?? 0} ${t('Pending Access Request')}`}
      </Text>
      {loading ? (
        <LoadingScreen />
      ) : pendingItems?.length > 0 ? (
        <>
          <List spacing={1} mt="1em" d="flex" flexDirection="column">
            {pendingItems.map(({ id, project }) => (
              <Box as="span" key={id}>
                <ListItem
                  p="3"
                  _hover={{ bg: '#F6F6F6' }}
                  display="flex"
                  // flexDirection='column'
                  justifyContent="space-between"
                  w="100%"
                  // as="button"
                >
                  <Stack>
                    <Text as="h2" textStyle="h2">
                      {project.title}
                    </Text>
                    <Text as="h6" textStyle="h6" color="#000">
                      {project.status === 'INPROGRESS'
                        ? 'IN PROGRESS'
                        : project.status === 'INREVIEW'
                          ? 'REVIEW'
                          : project.status}
                    </Text>
                  </Stack>
                  <Stack direction="row-reverse" spacing={2}>
                    <StimButton
                      size="stimSmall"
                      onClick={(e) => {
                        e.stopPropagation();
                        performAction({ id, accept: true });
                      }}
                      isLoading={loadingAccept || loadingReject}
                    >
                      {t('Accept')}
                    </StimButton>
                    <StimButton
                      size="stimSmall"
                      variant="stimDestructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        performAction({ id, accept: false });
                      }}
                      isLoading={loadingAccept || loadingReject}
                    >
                      {t('Reject')}
                    </StimButton>
                  </Stack>
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
          <Box p=".25rem 0">
            <Stack direction="row-reverse">
              <Pagination
                page={page}
                loading={loading}
                count={data?.searchUserCollaborations?.count ?? 0}
                rowsPerPageOptions={[2, 5, 10, 100, 500]}
                onChangePage={setPage}
                onChangeRowsPerPage={setLimit}
                rowsPerPage={limit}
              />
            </Stack>
          </Box>
        </>
      ) : (
        <Text textStyle="body">
          {t("You don't have any request for project access in pending based on your search criteria")}
        </Text>
      )}
    </Stack>
  );
};

export default ProjectsPendingAccess;
