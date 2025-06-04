import { createContext, useContext, useState } from 'react';
import { VectorDBCompany } from '../../components/Dashboard/reports.types';
import apiClient from '../../utils/apiClient';
import config from '../../config/environment.config';

const code = config.VECTOR_DATABASE_ACCESS_TOKEN;
const env = config.APP_ENVIRONMENT;

interface Dashboard3DMapContextProps {
  companies: VectorDBCompany[];
  loading: boolean;
  fetchCompanies: (companyId: string) => void;
}

export const Dashboard3DMapContext = createContext<Dashboard3DMapContextProps>({
  companies: [],
  loading: false,
  fetchCompanies: () => {},
});

export const Dashboard3DMapProvider = (props: { children: any }) => {
  const [companies, setCompanies] = useState<VectorDBCompany[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCompanies = async (companyId: string) => {
    try {
      setLoading(true);
      const sanitizedCode = code.replace(/'/g, '');
      const data: VectorDBCompany[] = await apiClient({
        endpoint: `most-similar-with-vector`,
        method: 'GET',
        params: { 'company-id': `${companyId}`, limit: 20, code: sanitizedCode, env, dimensions: 3 },
      });
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard3DMapContext.Provider value={{ companies, loading, fetchCompanies }}>
      {props.children}
    </Dashboard3DMapContext.Provider>
  );
};

export const useDashboard3DMapContext = () => useContext(Dashboard3DMapContext);
