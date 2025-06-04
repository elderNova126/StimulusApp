import { useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { useViewIdFilter } from '../../hooks';
import { DiscoveryState } from '../../stores/features';
import { Company } from '../Company/company.types';
import ComparisonChart from '../ComparisonChart';
import ComparisonTable from '../ComparisonTable';
import LoadingScreen from '../LoadingScreen';
const { DISCOVER_COMPANIES_COMPARE_GQL } = CompanyQueries;
const Comparison = (props: { viewId: string; selectedMenu: string }) => {
  const { viewId, selectedMenu } = props;
  const additionalFilter = useViewIdFilter(viewId, null);
  const [direction] = useState('ASC');
  const [orderBy] = useState('doingBusinessAs');
  const filters: any = useSelector((state: { discovery: DiscoveryState }) => state.discovery.variables);
  const { data, loading, refetch } = useQuery(DISCOVER_COMPANIES_COMPARE_GQL, {
    fetchPolicy: 'cache-and-network',
    variables: {
      direction,
      orderBy,
      ...additionalFilter,
      ...Object.keys(filters).reduce(
        (acc, curr) => ({
          ...acc,
          ...(!!filters[curr] && { [curr]: filters[curr] }),
        }),
        {}
      ),
      page: 1,
      limit: 25,
    },
  });

  const dataProps = useMemo(
    () => ({
      companies: (data?.discoverCompanies?.results || []).map((company: Company) => ({
        ...(company.stimulusScore !== null
          ? { ...company.stimulusScore?.results?.[0] }
          : {
              ...(company.stimulusScore = {
                results: [
                  {
                    scoreValue: 1000,
                    quality: 1000,
                    reliability: 1000,
                    features: 1000,
                    cost: 1000,
                    relationship: 1000,
                    financial: 1000,
                    diversity: 1000,
                    innovation: 1000,
                    flexibility: 1000,
                    brand: 1000,
                  },
                ],
              }),
            }),
        ...company.projectsOverview,
        ...company,
      })),
      loading,
    }),
    [data, loading]
  );
  useEffect(() => {
    refetch({
      ...(viewId === 'Favorites' && {
        isFavorite: true,
        direction,
        orderBy,
        ...Object.keys(filters).reduce(
          (acc, curr) => ({
            ...acc,
            ...(!!filters[curr] && { [curr]: filters[curr] }),
          }),
          {}
        ),
        page: 1,
        limit: 25,
      }),
    });
  }, [viewId]); // eslint-disable-line react-hooks/exhaustive-deps

  return loading ? (
    <LoadingScreen />
  ) : selectedMenu === 'chart' ? (
    <ComparisonChart data={dataProps} />
  ) : (
    <ComparisonTable transposeTable={selectedMenu === 'transpose'} data={dataProps} />
  );
};

export default Comparison;
