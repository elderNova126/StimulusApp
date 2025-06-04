import { useLazyQuery } from '@apollo/client';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useViewIdFilter } from '../../hooks';
import { DiscoveryState, setindexList, setListName, setReduxCount } from '../../stores/features';
import { navigate } from '@reach/router';
import { useTranslation } from 'react-i18next';
import { Box, Center, IconButton, Select, Text, Spinner } from '@chakra-ui/react';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { setFavoritesCount, setInternalsCount } from '../../stores/features/generalData';
import { Direction, SortBy } from '../../graphql/enums';

const { COUNTER_LIST } = CompanyQueries;

const BoxStile = {
  display: 'flex',
  flexDirection: 'row',
  margin: '5%',
  width: '100%',
};
const BoxText = {
  display: 'flex',
  flexDirection: 'row',
};
const verticalLine = {
  borderLeft: '2px  solid #cbcbcb',
  marginLeft: '5%',
  marginRight: '5%',
};

const horizentalLine = {
  borderTop: '2px solid #cbcbcb',
  width: '90%',
};

const ListsAndCounter = (props: { selectCompany?: void | any; showAlert: void | any }) => {
  const { showAlert } = props;
  const listName: string = useSelector((state: { discovery: DiscoveryState }) => state.discovery.listName);
  const index: number = useSelector((state: { discovery: DiscoveryState }) => state.discovery.indexList);
  const reduxCount: number = useSelector((state: { discovery: DiscoveryState }) => state.discovery.count);
  const filters: any = useSelector((state: { discovery: DiscoveryState }) => state.discovery.variables);
  const favoritesCount = useSelector((state: any) => state.generalData.favoritesCount);
  const internalsCount = useSelector((state: any) => state.generalData.internalsCount);
  const { t } = useTranslation();

  const [viewId, setViewId] = useState(listName);
  const [haveFav, setHaveFav] = useState(true);
  const [haveInte, setHaveInte] = useState(true);

  const [count, setcount] = useState(reduxCount);
  const [personalListName, setPersonalListName] = useState('');
  const RegEx: RegExp = /^[0-9]+$/;
  const dispatch = useDispatch();
  const [getCompanies, { loading }] = useLazyQuery(COUNTER_LIST, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-only',
    onCompleted: (data) => {
      if (data?.discoverCompanies?.count === 0) {
        if (viewId === 'favorites') setHaveFav(false);
        if (viewId === 'internal') setHaveInte(false);
        changeFilter('all');
        showAlert(true);
      }
      if (data?.discoverCompanies?.results && data?.discoverCompanies?.count) {
        if (viewId === 'favorites') dispatch(setFavoritesCount(data?.discoverCompanies?.count));
        if (viewId === 'internal') dispatch(setInternalsCount(data?.discoverCompanies?.count));
        dispatch(setReduxCount(data?.discoverCompanies?.count));
        setcount(data?.discoverCompanies?.count);
        navigate(`/company/${data?.discoverCompanies?.results[0].id}`, {
          state: { breadcrumb: { name: t('Companies'), href: '/companiesv2' } },
        });
      }
    },
  });

  useEffect(() => {
    if (RegEx.test(listName ?? '')) {
      setPersonalListName(listName ? listName : '');
    }
    if (favoritesCount !== null && favoritesCount === 0) {
      setHaveFav(false);
    }
    if (internalsCount !== null && internalsCount === 0) {
      setHaveInte(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const UpdateCompany = (currentView: string, index: number) => {
    const additionalFilters = useViewIdFilter(currentView, null);
    getCompanies({
      variables: {
        page: index,
        ...additionalFilters,
        limit: 1,
        direction: Direction.ASC,
        orderBy: SortBy.NAME,
        ...Object.keys(filters).reduce(
          (acc, curr) => ({
            ...acc,
            ...(!!filters[curr] && { [curr]: filters[curr] }),
          }),
          {}
        ),
      },
    });
  };

  const changeFilter = async (value: any) => {
    setViewId(value);
    dispatch(setListName(value));
    dispatch(setindexList(1));
    UpdateCompany(value, 1);
  };

  const handleNext = async (action: string) => {
    const newIndex = action === 'next' ? index + 1 : index - 1;
    dispatch(setindexList(newIndex));
    UpdateCompany(viewId, newIndex);
  };

  return (
    <Box>
      <Center>
        <Box sx={horizentalLine} />
      </Center>
      <Box sx={BoxStile}>
        <Box width={'auto'}>
          <Select
            size="sm"
            width="auto"
            variant="flushed"
            color={loading ? 'gray.500' : '#1a202c'}
            value={viewId}
            disabled={loading}
            onChange={(e: any) => changeFilter(e.target.value)}
          >
            <option value="all">All</option>
            {haveInte && <option value="internal">Internal</option>}
            {haveFav && <option value="favorites">Favorite</option>}
            {personalListName && <option value={personalListName}>Custom List</option>}
          </Select>
        </Box>
        <Box sx={verticalLine} />

        <Box sx={BoxText}>
          <Text marginTop={'2.5%'} style={{ fontSize: '1rem' }}>
            {`${index} of ${count ? count : '...'} Companies`}
          </Text>
          {loading ? (
            <Spinner size="md" marginStart={4} color="#93d9b5" />
          ) : (
            <IconButton
              width={'5%'}
              disabled={loading || count === 0 || index <= 1}
              _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}
              onClick={() => {
                handleNext('prev');
              }}
              aria-label="next page"
              variant="simple"
              icon={<ChevronLeftIcon style={{ fontSize: '1rem' }} />}
            />
          )}
          {loading ? null : (
            <IconButton
              width={'5%'}
              disabled={loading || count === 0 || index === count}
              _hover={{ bg: 'gradient.iconbutton', borderRadius: '30' }}
              onClick={() => {
                handleNext('next');
              }}
              aria-label="next page"
              variant="simple"
              icon={<ChevronRightIcon style={{ fontSize: '1rem' }} />}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ListsAndCounter;
