import { useMutation, useQuery } from '@apollo/client';
import { Box, Divider, Flex, Stack, Text } from '@chakra-ui/layout';
import { RouteComponentProps } from '@reach/router';
import jwt_decode from 'jwt-decode';
import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalStorageContext } from '../../context/LocalStorage';
import OtherMutations from '../../graphql/Mutations/OtherMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import UserQueries from '../../graphql/Queries/UserQueries';
import { useStimulusToast } from '../../hooks';
import { CompanyAvatar } from '../GenericComponents';

interface Tenant {
  id: string;
  isDefault: boolean;
  provisionStatus: string;
  name: string;
  tenantCompany: {
    id: string;
    ein: string;
  };
}
const { ISSUE_CONTEXT_TOKEN_GQL } = OtherMutations;
const { USER_TENANTS } = UserQueries;
const { COMPANY_EIN_SEARCH_GQL } = CompanyQueries;
const Account: FC<RouteComponentProps> = (props) => {
  const { t } = useTranslation();
  const { tenantToken, setTenantToken } = useContext(LocalStorageContext);
  const { data } = useQuery(USER_TENANTS(), { fetchPolicy: 'cache-first' });
  const tenants: Tenant[] =
    data?.userTenants?.filter?.((tenant: Tenant) => tenant.provisionStatus === 'provisioned') || [];
  const { tenantId: currentTenantId }: any = jwt_decode(tenantToken as string);
  const { enqueueSnackbar } = useStimulusToast();

  const [issueContextToken, { client }] = useMutation(ISSUE_CONTEXT_TOKEN_GQL, {
    update: (
      _,
      {
        data: {
          issueContextToken: { token },
        },
      }
    ) => {
      if (token) {
        setTenantToken(token);
        client.resetStore();
        enqueueSnackbar(`Tenant changed!`, { status: 'success' });
      }
    },
  });

  return (
    <Stack w="95%">
      <Text as="h1" textStyle="h1">
        {t('Account')}
      </Text>
      <Box pt="50px">
        <Text as="h2" textStyle="h2">
          {t('Linked Companies')}
        </Text>
        <Divider />
        <Flex flexWrap="wrap" pt="3">
          {tenants.map((tenant) => (
            <LinkedTenant
              key={tenant.id}
              active={currentTenantId === tenant.id}
              tenant={tenant}
              onClick={() => issueContextToken({ variables: { tenantId: tenant.id } })}
            />
          ))}
        </Flex>
      </Box>
    </Stack>
  );
};

const LinkedTenant: FC<{ tenant: Tenant; active: boolean; onClick: () => void }> = (props) => {
  const { tenant, active, onClick } = props;
  const { data } = useQuery(COMPANY_EIN_SEARCH_GQL(tenant?.tenantCompany?.ein), { fetchPolicy: 'cache-first' });
  const company = data?.searchCompanies?.results?.[0];

  return (
    <Flex
      w="25%"
      onClick={onClick}
      cursor="pointer"
      p="2"
      border={`1px solid ${active ? '#000' : 'transparent'}`}
      _hover={{ borderColor: '#000' }}
    >
      {company && (
        <>
          <CompanyAvatar size="xs" companyId={company?.id} name={tenant.name} />
          <Text pl="2" textStyle="h4">
            {tenant.name}
          </Text>
        </>
      )}
    </Flex>
  );
};
export default Account;
