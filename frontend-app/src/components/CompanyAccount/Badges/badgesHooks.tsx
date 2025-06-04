import { useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import BadgesQueries from '../../../graphql/Queries/BadgeQueries';
import BadgesMutations from '../../../graphql/Mutations/BadgeMutations';
import { Badge } from './badge.types';
import { useStimulusToast } from '../../../hooks';

const { BADGE_TENANT } = BadgesQueries;
const { DELETE_BADGE, UPDATE_BADGE, CREATE_BADGE } = BadgesMutations;

const useBadgeQuery = (form: boolean, badge: Badge | boolean) => {
  const [getBadges, { data, loading }] = useLazyQuery(BADGE_TENANT, { fetchPolicy: 'cache-and-network' });

  useEffect(() => {
    getBadges();
  }, [form, badge]);

  return { data, loading };
};

const useDeleteBadge = () => {
  const { enqueueSnackbar } = useStimulusToast();
  const [deleteBadgeMutation, { loading: loadingDelete }] = useMutation(DELETE_BADGE);

  const deleteBadge = async (id: string) => {
    try {
      await deleteBadgeMutation({ variables: { id } });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      enqueueSnackbar(errorMessage, { status: 'error' });
    }
  };

  return { deleteBadge, loadingDelete };
};

const useCreateBadge = (resetStates: () => void) => {
  const { enqueueSnackbar } = useStimulusToast();
  const [createBadgeMutation, { loading: loadingCreate }] = useMutation(CREATE_BADGE);

  const createBadge = async (badge: any) => {
    try {
      await createBadgeMutation({
        variables: badge,
        onCompleted(data) {
          if (data) resetStates();
        },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      enqueueSnackbar(errorMessage, { status: 'error' });
    }
  };

  return { createBadge, loadingCreate };
};

const useUpdateBadge = (resetStates: () => void) => {
  const { enqueueSnackbar } = useStimulusToast();
  const [updateBadgeMutation, { loading: loadingUpdate }] = useMutation(UPDATE_BADGE);

  const updateBadge = async (badge: any) => {
    try {
      await updateBadgeMutation({
        variables: badge,
        onCompleted(data) {
          if (data) resetStates();
        },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      enqueueSnackbar(errorMessage, { status: 'error' });
    }
  };

  return { updateBadge, loadingUpdate };
};

export { useBadgeQuery, useDeleteBadge, useCreateBadge, useUpdateBadge };
