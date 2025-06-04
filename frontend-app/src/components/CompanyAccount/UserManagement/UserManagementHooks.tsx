import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import UserQueries from '../../../graphql/Queries/UserQueries';
const { TENANT_USERS_GQL } = UserQueries;

const useActiveUsers = (page: number, limit: number) => {
  const [getActiveUsers, { loading: loadingUsers, data: dataActive }] = useLazyQuery(TENANT_USERS_GQL, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getActiveUsers({ variables: { limit, page } });
  }, [page, limit]);

  return {
    loading: loadingUsers,
    data: dataActive?.tenantUsers?.results,
    count: dataActive?.tenantUsers?.count,
  };
};

const usePendingUsers = (page: number, limit: number, typeOfList: string) => {
  const [getPendingUsers, { loading: loadingUsersPending, data: dataPending }] = useLazyQuery(TENANT_USERS_GQL, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getPendingUsers({ variables: { page, limit, typeOfList } });
  }, [page, limit, typeOfList]);

  return {
    loading: loadingUsersPending,
    data: dataPending?.tenantUsers?.results,
    count: dataPending?.tenantUsers?.count,
  };
};

export { useActiveUsers, usePendingUsers };
