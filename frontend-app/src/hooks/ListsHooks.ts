import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import CompanyQueries from '../graphql/Queries/CompanyQueries';
import { GeneralTypeList } from '../graphql/types';

const { COUNT_COMPANIES_LIST } = CompanyQueries;
export const useCountCompaniesByList = (listType: GeneralTypeList) => {
  const [count, setCount] = useState(0);
  const [getCountCompaniesByList, { loading }] = useLazyQuery(COUNT_COMPANIES_LIST, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const { countCompaniesByList } = data;
      setCount(countCompaniesByList?.count);
    },
  });
  useEffect(() => {
    getCountCompaniesByList({
      variables: {
        listType,
      },
    });
  }, []);

  return { count, loading };
};
