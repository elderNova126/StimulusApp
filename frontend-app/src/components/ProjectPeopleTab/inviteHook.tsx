import { useMutation, useLazyQuery } from '@apollo/client';
import { useStimulusToast } from '../../hooks';
import UserMutations from '../../graphql/Mutations/UserMutations';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import * as R from 'ramda';
import UserQueries from '../../graphql/Queries/UserQueries';

const { PROJECT_COLLABORATORS } = ProjectQueries;
const { INVITE_USER_TO_PROJECT } = UserMutations;
const { GET_USER_BY_NAME } = UserQueries;

const useSendInvitation = (projectId: number, setSearchValue: (data: string) => void) => {
  const { enqueueSnackbar } = useStimulusToast();
  const { t } = useTranslation();

  const [inviteUser, { loading: inviteLoading }] = useMutation(INVITE_USER_TO_PROJECT, {
    update: (cache, { data: { createProjectCollaboration: collaboration } }) => {
      if (!collaboration.error) {
        enqueueSnackbar(t('User invited'), { status: 'success' });
        const { searchProjectCollaborations } = R.clone(
          cache.readQuery({ query: PROJECT_COLLABORATORS, variables: { projectId } })
        ) as any;
        searchProjectCollaborations.results = [collaboration, ...(searchProjectCollaborations?.results ?? [])];

        cache.writeQuery({
          query: PROJECT_COLLABORATORS,
          variables: { projectId },
          data: { searchProjectCollaborations: { ...searchProjectCollaborations } },
        });
      }
      setSearchValue('');
    },
  });

  const sendUserInvitation = async (userInfo: any) => {
    try {
      await inviteUser({
        variables: userInfo,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      enqueueSnackbar(errorMessage, { status: 'error' });
    }
  };

  return { sendUserInvitation, inviteLoading };
};

const useSearchUsers = (searchValue: string) => {
  const [getUser, { data, loading }] = useLazyQuery(GET_USER_BY_NAME, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-only',
    variables: { surname: searchValue },
  });

  useEffect(() => {
    getUser();
  }, [searchValue]);

  return { data, loading };
};

export { useSendInvitation, useSearchUsers };
