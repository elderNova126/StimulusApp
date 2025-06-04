import { useQuery } from '@apollo/client';
import { createContext } from 'react';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { useTenantCompany } from '../../hooks';

export const TenantCompanyContext = createContext({ tenantCompany: {} as any, loading: false });

const { COMPANY_EIN_SEARCH_GQL } = CompanyQueries;

export const TenantCompanyProvider = (props: { children: any }) => {
  const { tenantCompanyEin } = useTenantCompany();
  const { data, loading } = useQuery(COMPANY_EIN_SEARCH_GQL(tenantCompanyEin), { fetchPolicy: 'cache-first' });
  const tenantCompany = data?.searchCompanies?.results?.[0];
  return (
    <TenantCompanyContext.Provider value={{ tenantCompany, loading }}>{props.children}</TenantCompanyContext.Provider>
  );
};
