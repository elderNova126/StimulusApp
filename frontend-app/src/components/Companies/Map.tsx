import { useLazyQuery } from '@apollo/client';
import { Box, Stack } from '@chakra-ui/react';
import { navigate, useLocation, useParams } from '@reach/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { DiscoveryState } from '../../stores/features';
import { useViewIdFilter } from '../../hooks/index';
import { CompaniesMapTable } from '../CompaniesMapTable';
import { CompanyProfileDivider } from '../Company/shared';
import { Pagination } from '../GenericComponents';
import MapBanner from '../GenericComponents/MapBanner';
import Map from '../Map';
import LoadingScreen from '../LoadingScreen';
import LocationFilter from '../CompaniesFilters/BasicFilters/LocationFilters';
const { DISCOVER_COMPANIES_MAP_GQL } = CompanyQueries;

const CompaniesMap = (props: { viewId: string }) => {
  const params = useParams();
  const urlLocation = useLocation();
  const pathname = urlLocation.pathname.replace(/\d.*/g, "$'");
  const filters: any = useSelector((state: { discovery: DiscoveryState }) => state.discovery.variables);
  const [page, setPage] = useState(Number(params?.page));
  const [limit, setLimit] = useState(10);
  const [banner, setBanner] = useState(false);
  const additionalFilter = useViewIdFilter(props.viewId, null);

  const errorMap = useSelector((state: { generalData: any }) => state.generalData?.errorMap);
  const [getCompanies, { data, loading }] = useLazyQuery(DISCOVER_COMPANIES_MAP_GQL, {
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    getCompanies({
      variables: {
        page,
        limit,
        ...additionalFilter,
        ...Object.keys(filters).reduce(
          (acc, curr) => ({
            ...acc,
            ...(!!filters[curr] && { [curr]: filters[curr] }),
          }),
          {}
        ),
      },
      onError: () => {
        navigate('/companies/all/map/1');
      },
    });
  }, [page, limit, filters, props.viewId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPage(Number(params.page));
  }, [params]);

  const companiesMapTable = useMemo(
    () => (
      <CompaniesMapTable
        showBanner={setBanner}
        companies={errorMap ? [] : (data?.discoverCompaniesMap.results ?? [])}
      />
    ),
    [data, errorMap]
  );

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Stack direction="row">
          <Stack flex="1" direction="column" height="70vh">
            <LocationFilter showTitle={false} />
            <Box overflow="scroll">
              <Box p=".25rem 0" borderTop="solid 0.5px #D4D4D4">
                <Pagination
                  pathname={pathname}
                  hideRowsPerPage={true}
                  page={page}
                  loading={loading}
                  count={errorMap ? 0 : (data?.discoverCompaniesMap?.count ?? 0)}
                  rowsPerPageOptions={[50, 100, 500]}
                  onChangePage={setPage}
                  onChangeRowsPerPage={setLimit}
                  rowsPerPage={limit}
                />
              </Box>
              <CompanyProfileDivider />
              <Stack>
                <Box minHeight="200px">{companiesMapTable}</Box>
              </Stack>
            </Box>
          </Stack>
          <Box flex="3">{banner ? <MapBanner /> : <Map companies={data?.discoverCompaniesMap?.results ?? []} />}</Box>
        </Stack>
      )}
    </>
  );
};

export default CompaniesMap;
