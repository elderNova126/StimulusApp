import { useMutation, useQuery } from '@apollo/client';
import * as R from 'ramda';
import { ApiKey } from '../graphql/Models/ApiKey';
import ExternalSystemAuthMutations from '../graphql/Mutations/ExternalSystemAuth';
import ExternalSystemAuthQueries from '../graphql/Queries/ExternalSystemAuthQueries';

const { GET_API_KEYS } = ExternalSystemAuthQueries;
const { CREATE_NEW_API_KEY, CHANGE_STATUS_API_KEY, REMOVE_API_KEY } = ExternalSystemAuthMutations;

export const ManagerTenantKeysHook = () => {
  const { data: apiKeys, loading } = useQuery(GET_API_KEYS, {
    fetchPolicy: 'cache-first',
  });

  const results = apiKeys ? apiKeys.getApiKeys.results : [];
  return { results, loading };
};

export const CreateApiKeyHook = () => {
  const [createApiKey, { loading, data }] = useMutation(CREATE_NEW_API_KEY);

  const createNewApiKey = (variables: any) => {
    return new Promise((res, rej) => {
      createApiKey({
        variables,
        update: async (cache, { data }) => {
          if (data) {
            const { createNewApiKey } = data;
            const { getApiKeys } = (await R.clone(cache.readQuery({ query: GET_API_KEYS }))) as any;
            if (getApiKeys) {
              getApiKeys.results.push({ ...createNewApiKey });
              cache.writeQuery({
                query: GET_API_KEYS,
                data: { getApiKeys },
              });
            }
          }
        },
      }).finally(() => {
        res(true);
      });
    });
  };

  return { createNewApiKey, loading, data };
};

export const RemoveApiKeyHook = () => {
  const [removeApiKey, { loading, data }] = useMutation(REMOVE_API_KEY);

  const deleteApiKey = (variable: any) => {
    return new Promise((res, rej) => {
      removeApiKey({
        variables: variable,
        update: async (cache, { data }) => {
          const { removeApiKey } = data;
          if (removeApiKey.successful) {
            const { getApiKeys } = (await R.clone(cache.readQuery({ query: GET_API_KEYS }))) as any;
            if (getApiKeys) {
              getApiKeys.results.splice(
                getApiKeys.results.findIndex((item: ApiKey) => item.id === variable.id),
                1
              );

              cache.writeQuery({
                query: GET_API_KEYS,
                data: { getApiKeys },
              });
            }
          }
        },
      }).finally(() => {
        res(true);
      });
    });
  };

  return { deleteApiKey, loading, data };
};

export const ChangeStatusApiKeyHook = () => {
  const [changeStatusApiKey, { loading, data }] = useMutation(CHANGE_STATUS_API_KEY);

  const changeStatus = (variable: any) => {
    return new Promise((res, rej) => {
      changeStatusApiKey({
        variables: variable,
        update: async (cache, { data }) => {
          const { updateApiKey } = data;
          if (updateApiKey) {
            const { getApiKeys } = (await R.clone(cache.readQuery({ query: GET_API_KEYS }))) as any;
            if (getApiKeys) {
              getApiKeys.results.map((apiKey: any) => {
                if (apiKey.id === updateApiKey.id) {
                  apiKey = updateApiKey;
                }
                return apiKey;
              });
              cache.writeQuery({
                query: GET_API_KEYS,
                data: { getApiKeys },
              });
            }
          }
        },
      }).finally(() => {
        res(true);
      });
    });
  };

  return { changeStatus, loading, data };
};
