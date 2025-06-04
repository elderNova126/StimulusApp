import { useMutation, useQuery } from '@apollo/client';
import { CircularProgress, Container, Grid, Typography } from '@material-ui/core';
import * as R from 'ramda';
import { useTranslation } from 'react-i18next';
import UserMutations from '../../graphql/Mutations/UserMutations';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import UserQueries from '../../graphql/Queries/UserQueries';
import { User } from '../../graphql/types';
import { useStimulusToast } from '../../hooks';
import { UserAvatar } from '../GenericComponents';
import GenericModal from '../GenericModal';
import GenericTable from '../GenericTable';
import useStyles from './style';

const { TENANT_USERS_GQL } = UserQueries;
const { PROJECT_COLLABORATORS } = ProjectQueries;
const { INVITE_USER_TO_PROJECT } = UserMutations;

const ProjectPeopleInviteModal = (props: { projectId: number; invitedUsers: any[]; onClose: () => void }) => {
  const { onClose, projectId, invitedUsers } = props;
  const classes = useStyles();
  const { loading: loadingUsers, data } = useQuery(TENANT_USERS_GQL, { fetchPolicy: 'cache-first' });
  const { enqueueSnackbar } = useStimulusToast();
  const { t } = useTranslation();

  const [inviteUser, { loading: inviteLoading }] = useMutation(INVITE_USER_TO_PROJECT, {
    update: (cache, { data: { createProjectCollaboration: collaboration } }) => {
      if (!collaboration.error) {
        enqueueSnackbar(t('User invited'), { status: 'success' });
        const { searchProjectCollaborations } = R.clone(
          cache.readQuery({ query: PROJECT_COLLABORATORS, variables: { projectId } })
        ) as any;
        searchProjectCollaborations.results = [...(searchProjectCollaborations?.results ?? []), collaboration];

        cache.writeQuery({
          query: PROJECT_COLLABORATORS,
          variables: { projectId },
          data: { searchProjectCollaborations: { ...searchProjectCollaborations } },
        });
      }
    },
  });

  const tenantUsers = data?.tenantUsers?.filter?.(({ accountEnabled }: any) => accountEnabled);
  const content = {
    showHeaders: false,
    headers: [{ mappedKey: 'jsxContent', align: 'left' }],
    rows: (tenantUsers || []).map((user: User) => ({
      ...user,
      jsxContent: (
        <Grid container alignItems="center" spacing={2}>
          <UserAvatar userId={user.id} />
          <Grid item>
            <Typography className={classes.username}> {`${user?.givenName ?? ''} ${user?.surname ?? ''}`}</Typography>
            <Typography className={classes.userTitle}> {user?.jobTitle ?? ''}</Typography>
          </Grid>
        </Grid>
      ),
    })),
    actions: [
      {
        label: (user: User) => (!invitedUsers.find(({ id }: User) => user.id === id) ? 'Invite' : 'Invited'),
        onClick: (e: any, user: User) => {
          if (!invitedUsers.find(({ id }: User) => user.id === id)) {
            inviteUser({ variables: { userId: user.id, projectId, userType: 'collaborator' } });
          }
        },
        className: classes.actionBtn,
      },
    ],
  };
  const inviteModalActions = [{ label: t('Close'), onClick: onClose }];
  return (
    <GenericModal maxWidth="md" onClose={onClose} buttonActions={inviteModalActions}>
      <Container maxWidth="md" data-testid="projectPeople-invite-modal">
        <Grid container spacing={2} className={classes.content}>
          <Grid item xs={12}>
            <Typography className={classes.title}>
              <b>{t('Invite User')}</b>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {loadingUsers || inviteLoading ? (
              <CircularProgress />
            ) : (
              <GenericTable variant="regular" content={content} />
            )}
          </Grid>
        </Grid>
      </Container>
    </GenericModal>
  );
};

export default ProjectPeopleInviteModal;
