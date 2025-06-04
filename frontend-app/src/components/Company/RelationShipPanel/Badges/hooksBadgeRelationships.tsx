import { useMutation, useLazyQuery } from '@apollo/client';
import BadgeMutations from '../../../../graphql/Mutations/BadgeMutations';
import { useStimulusToast } from '../../../../hooks';
import BadgesQueries from '../../../../graphql/Queries/BadgeQueries';
import { Badge } from '../../../CompanyAccount/Badges/badge.types';

const { CREATE_BADGE_TENANT_RELATIONSHIPS, UPDATE_BADGE_TENANT_RELATIONSHIPS, DELETE_BADGE_TENANT_RELATIONSHIPS } =
  BadgeMutations;
const { BADGE_TENANT } = BadgesQueries;

const useBadgeRelationshipQuery = (company: any, setBadgesRelationship: (data: any) => void) => {
  const [getBadges, { data, loading }] = useLazyQuery(BADGE_TENANT, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const myBadges = data?.badges?.results?.filter((badge: Badge) => {
        return badge?.badgeTenantCompanyRelationships?.some(
          (value: any) => value?.tenantCompanyRelationshipId === company?.tenantCompanyRelation.id
        );
      });

      setBadgesRelationship(myBadges);
    },
  });

  return { getBadges, data, loading };
};

const useCreateBadgeTenantRelationship = () => {
  const { enqueueSnackbar } = useStimulusToast();
  const [createTenantRelationshipMutation] = useMutation(CREATE_BADGE_TENANT_RELATIONSHIPS);

  const createTenantRelationship = async (relationship: any) => {
    try {
      await createTenantRelationshipMutation({
        variables: relationship,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      enqueueSnackbar(errorMessage, { status: 'error' });
    }
  };

  return { createTenantRelationship };
};

const useUpdateBadgeTenantRelationship = () => {
  const { enqueueSnackbar } = useStimulusToast();
  const [updateTenantRelationshipMutation] = useMutation(UPDATE_BADGE_TENANT_RELATIONSHIPS);

  const updateTenantRelationship = async (relationship: any) => {
    try {
      await updateTenantRelationshipMutation({
        variables: relationship,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      enqueueSnackbar(errorMessage, { status: 'error' });
    }
  };

  return { updateTenantRelationship };
};

const useDeleteBadgeRelationship = () => {
  const { enqueueSnackbar } = useStimulusToast();
  const [deleteBadgesRelationshipsMutation] = useMutation(DELETE_BADGE_TENANT_RELATIONSHIPS);

  const deleteBadgeRelationships = async (relationshipsId: any) => {
    try {
      await deleteBadgesRelationshipsMutation({
        variables: relationshipsId,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      enqueueSnackbar(errorMessage, { status: 'error' });
    }
  };

  return { deleteBadgeRelationships };
};

export {
  useCreateBadgeTenantRelationship,
  useUpdateBadgeTenantRelationship,
  useBadgeRelationshipQuery,
  useDeleteBadgeRelationship,
};
