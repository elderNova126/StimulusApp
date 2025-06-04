import { useLazyQuery, useMutation } from '@apollo/client';
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { navigate, useLocation, useParams } from '@reach/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ListsMutations from '../../graphql/Mutations/ListsMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { Direction, SortBy } from '../../graphql/enums';
import { ViewIdType, useStimulusToast, useViewIdFilter } from '../../hooks';
import { DiscoveryState, setListName, setReduxCount, setindexList } from '../../stores/features';
import {
  CustomListCount,
  setCustomListsCount,
  setFavoritesCount,
  setInternalsCount,
  setLimitCompanies,
} from '../../stores/features/generalData';
import { getNumberOfAppliedFilters } from '../../utils/companies/getNumberOfAppliedFilters';
import { capitalizeFirstLetter, getCompanyName } from '../../utils/dataMapper';
import CompanyListActions from '../CompanyListActions';
import CompanyListBulkActions from '../CompanyListBulkActions';
import { CompanyLink } from '../EntityLink';
import { Pagination } from '../GenericComponents';
import AlertDialogCustom from '../GenericComponents/AlertDialogComponent';
import { CustomTooltip } from '../GenericComponents/CustomTooltip';
import MessageComponent from '../GenericComponents/MessageComponent';
import NoResultBox from '../NotFound/NoResultsBox';
import LoadingScreen from '../LoadingScreen';
const { DISCOVER_COMPANIES_GQL, DISCOVER_COMPANIES_SELECT100 } = CompanyQueries;
const { REMOVE_COMPANY_FROM_LIST } = ListsMutations;

export interface CompanyWithCheck {
  id: string;
  isFavorite: boolean;
  isInternal: boolean;
}
export interface RowHolder {
  id: string;
}

const CompanyList = (props: { viewId: string; bannerUp?: any; tenant: any }) => {
  const params = useParams();
  const limitList = useSelector((state: any) => state.generalData.limit.companies);
  const [page, setPage] = useState(Number(params?.page));
  const [limit, setLimit] = useState(limitList);
  const [direction, setDirection] = useState(Direction.ASC);
  const [orderBy, setOrderBy] = useState(SortBy.NAME);
  const [bulkSelected, setBulkSelected] = useState<CompanyWithCheck[]>([]);
  const [optionSelected, setOptionSelected] = useState('None');
  const [companiesSelected, setCompanySelected] = useState<any>({});
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const cancelRef = useRef();
  const { viewId, bannerUp, tenant } = props;
  const [removeFromList] = useMutation(REMOVE_COMPANY_FROM_LIST);
  const filters: any = useSelector((state: { discovery: DiscoveryState }) => state.discovery.variables);
  const { t } = useTranslation();
  const additionalFilters = useViewIdFilter(viewId, tenant);
  const { enqueueSnackbar } = useStimulusToast();
  const location = useLocation();
  const pathname = location.pathname.replace(/\d.*/g, "$'");
  const dispatch = useDispatch();
  const numberOfFilters: any = useSelector((state: { discovery: DiscoveryState }) => {
    return getNumberOfAppliedFilters(state.discovery);
  });
  const customListsCount: CustomListCount[] = useSelector((state: any) => state.generalData.customListsCount);

  useEffect(() => {
    dispatch(setLimitCompanies(limit));
  }, [limit]);

  const [getCompanies, { loading: loadingCompanies, data }] = useLazyQuery(DISCOVER_COMPANIES_GQL, {
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      if (data?.discoverCompanies?.__typename === 'ErrorResponse') {
        if (checkTypeOfView(viewId) !== ViewIdType.ALL) {
          enqueueSnackbar('No access to this list', { status: 'error' });
          navigate('/companies/all/list/1');
        }
        return;
      }
    },
  });
  const discoverCompanies = data?.discoverCompanies ?? {};
  const [selectAllCompanies, { data: all }] = useLazyQuery(DISCOVER_COMPANIES_SELECT100, {
    fetchPolicy: 'cache-and-network',
  });

  function getList() {
    getCompanies({
      variables: {
        page,
        direction,
        limit,
        orderBy,
        ...additionalFilters,
        ...Object.keys(filters).reduce(
          (acc, curr) => ({
            ...acc,
            ...(!!filters[curr] && { [curr]: filters[curr] }),
          }),
          {}
        ),
      },
      onError: (error) => {
        if (error.message.includes('No access to this list')) {
          enqueueSnackbar('No access to this list', { status: 'error' });
          navigate('/companies/all/list/1');
          return;
        }
        navigate('/companies/all/list/1');
      },
    });
  }

  useEffect(() => setBulkSelected([]), [viewId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getList();
    dispatch(setLimitCompanies(limit));
  }, [page, limit, orderBy, direction, filters, viewId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPage(Number(params.page));
  }, [params]);

  useEffect(() => {
    if (optionSelected === 'All' && limit !== 500) {
      selectAllCompanies({
        variables: {
          direction,
          orderBy,
          ...additionalFilters,
          ...Object.keys(filters).reduce(
            (acc, curr) => ({
              ...acc,
              ...(!!filters[curr] && { [curr]: filters[curr] }),
            }),
            {}
          ),
        },
      });
    }
  }, [optionSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  const [companies, setCompanies] = useState(discoverCompanies?.results ?? []);
  useEffect(() => {
    if (numberOfFilters === 0 && viewId === 'favorites') {
      dispatch(setFavoritesCount(discoverCompanies?.count));
    }
    if (numberOfFilters === 0 && viewId === 'internal') {
      dispatch(setInternalsCount(discoverCompanies?.count));
    }

    if (numberOfFilters === 0 && Number(viewId) > 0) {
      const currentList = customListsCount.filter((item: any) => Number(item.id) !== Number(viewId));
      const currentItem: any = customListsCount.find((item: any) => Number(item.id) === Number(viewId));

      let count = 0;
      if (currentItem) {
        if (currentItem.count) {
          count = currentItem.count;
        }
      }

      const customListCount: CustomListCount = {
        id: Number(viewId),
        count: discoverCompanies ? discoverCompanies?.count : count,
      };
      dispatch(setCustomListsCount([...currentList, customListCount]));
    }
    setCompanies(discoverCompanies?.results ?? []);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (optionSelected === 'All') {
      if (all?.discoverCompanies?.results?.length > 0 && limit !== 500) {
        setBulkSelected(
          Array.from(
            new Set([
              ...(all?.discoverCompanies?.results ?? []).map((company: any) => {
                return {
                  id: company.id,
                  isFavorite: company.tenantCompanyRelation.isFavorite,
                  isInternal: company.tenantCompanyRelation.type === 'internal',
                };
              }),
            ])
          )
        );
      } else if (limit === 500) {
        setBulkSelected(
          Array.from(
            new Set([
              ...(companies?.slice(0, 100) ?? []).map((company: any) => ({
                id: company.id,
                isFavorite: company.tenantCompanyRelation.isFavorite,
                isInternal: company.tenantCompanyRelation.type === 'internal',
              })),
            ])
          )
        );
      }
    }
  }, [all, optionSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      (data?.discoverCompanies?.count === 0 || data?.discoverCompanies?.__typename === 'ErrorResponse') &&
      viewId === 'favorites' &&
      numberOfFilters < 1 &&
      !loadingCompanies
    ) {
      bannerUp(true);
    } else {
      bannerUp(false);
    }
  }, [loadingCompanies, viewId, data]); // eslint-disable-line react-hooks/exhaustive-deps

  const toastIdRef: any = useRef();
  const toast = useToast();
  const closeToast = () => {
    toast.close(toastIdRef.current);
  };

  const handleSort = (companiId: string) => {
    let index: number = 0;
    companies.find((company: any, i: number) => {
      if (company.id === companiId) {
        index = i + 1;
        return true;
      }
      return false;
    });
    index = limit * (page - 1) + index;
    dispatch(setListName(viewId));
    dispatch(setindexList(index));
    dispatch(setReduxCount(data?.discoverCompanies?.count ?? 0));
    navigate(`/company/${companiId}`, {
      state: { breadcrumb: { name: t('Companies'), href: '/companiesv2' } },
    });
  };

  const checkTypeOfView = (view: string) => {
    if (view === ViewIdType.FAVORITES) return 'favorites';
    if (view === ViewIdType.INTERNAL) return 'internal';
    if (view === ViewIdType.ALL) return 'all';
    return 'custom';
  };

  const handleDeleteFronTheList = async () => {
    setIsOpenDialog(!isOpenDialog);
    setCompanies(companies.filter((company: any) => company.id !== companiesSelected));
    await removeFromList({
      variables: { listId: `${viewId}`, companyIds: [companiesSelected.id], tenantId: tenant ? tenant.id : null },
      update: (cache, { data }) => {
        if (data?.removeFromCompanyList?.__typename === 'ErrorResponse') {
          enqueueSnackbar("Can't remove company from list", { status: 'error' });
        } else {
          const { removeFromCompanyList } = data;
          const { id } = removeFromCompanyList;
          setCompanies(removeFromCompanyList.companies.results);

          const stringForMessage = t(` removed from list `);
          const message = (
            <span>
              <CompanyLink id={companiesSelected.id} name={getCompanyName(companiesSelected)} />
              {stringForMessage}
              {removeFromCompanyList.name}
            </span>
          );
          toastIdRef.current = toast({
            render: () => <MessageComponent message={message} close={closeToast} />,
          });

          const currentList = customListsCount.filter((item: any) => Number(item.id) !== Number(viewId));
          const uniqueCompanies: string[] = [];
          removeFromCompanyList?.companyIds?.forEach((id: string) => {
            if (!uniqueCompanies.includes(id)) {
              uniqueCompanies.push(id);
            }
          });
          const customListItemCount: CustomListCount = {
            id: Number(id),
            count: Number(uniqueCompanies.length),
          };
          dispatch(setCustomListsCount([...currentList, customListItemCount]));
        }
      },
    });
  };

  const handleOpenDialogo = (company: any) => {
    setCompanySelected(company);
    setIsOpenDialog(!isOpenDialog);
  };

  const handleCloseDialogo = () => {
    setIsOpenDialog(!isOpenDialog);
  };

  const selectAll = () => {
    setOptionSelected('All');
  };

  useEffect(() => {
    if (!!bulkSelected.length === false) {
      setOptionSelected('None');
    }
  }, [bulkSelected]);

  const loading = companies?.length === 0 && loadingCompanies;
  const bulkIconSrc = useMemo(() => {
    for (const company of companies) {
      if (bulkSelected.indexOf(company.id) < 0) {
        return bulkSelected.length > 0 ? 'checked' : 'unchecked';
      }
    }
    return companies.length > 0 ? 'checked' : 'unchecked';
  }, [companies, bulkSelected]);
  return (
    <Box pr="1.5rem">
      <Box p=".25rem 0">
        <Stack direction="row-reverse">
          <Pagination
            pathname={pathname}
            page={page}
            loading={loading}
            count={discoverCompanies?.count ?? 0}
            rowsPerPageOptions={[5, 10, 50, 100, 500]}
            onChangePage={setPage}
            onChangeRowsPerPage={setLimit}
            rowsPerPage={limit}
          />
          {bulkSelected.length > 0 && (
            <CompanyListBulkActions
              filters={filters}
              direction={direction}
              orderBy={orderBy}
              limit={limit}
              page={page}
              additionalFilters={additionalFilters}
              bulkSelection={bulkSelected}
              setBulk={setBulkSelected}
            />
          )}
        </Stack>
      </Box>
      <Table variant="simple" size="sm">
        {discoverCompanies?.count > 0 && (
          <Thead>
            <Tr>
              <Th border="0.5px solid #D5D5D5" borderLeft="none" width="185px">
                <Flex>
                  <Box>
                    <Menu>
                      <Center>
                        <Box ml="9px" _hover={{ bg: 'gradient.iconbutton', borderRadius: '15px' }} p="0 8px">
                          <MenuButton
                            size="sm"
                            display="flex"
                            variant="unstyled"
                            as={Button}
                            leftIcon={
                              <Flex alignItems="center">
                                <Image width="14px" src={`/icons/checkbox_${bulkIconSrc}.svg`} />
                                <ChevronDownIcon />
                              </Flex>
                            }
                          >
                            <Text fontSize="13px" fontWeight={600}>
                              {bulkSelected.length > 0 && bulkSelected.length}
                            </Text>
                          </MenuButton>
                        </Box>
                      </Center>
                      <MenuList
                        borderRadius={0}
                        border="1px solid #E4E4E4"
                        boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25);"
                      >
                        <MenuItem
                          fontWeight={'bold'}
                          onClick={() => {
                            selectAll();
                          }}
                        >
                          {t('All')}
                        </MenuItem>
                        <MenuItem
                          fontWeight={'bold'}
                          _hover={{ color: 'white' }}
                          onClick={() => {
                            setOptionSelected('visible');
                            const toVisible = companies.map((company: any) => {
                              return {
                                id: company.id,
                                isFavorite: company.tenantCompanyRelation.isFavorite,
                                isInternal: company.tenantCompanyRelation.type === 'internal' ? true : false,
                              };
                            });
                            setBulkSelected(Array.from(new Set([...toVisible])));
                          }}
                        >
                          {t('Visible')}
                        </MenuItem>
                        <MenuItem
                          fontWeight={'bold'}
                          fontStyle={'bold'}
                          _hover={{ color: 'white' }}
                          onClick={() => {
                            setOptionSelected('None');
                            setBulkSelected([]);
                          }}
                        >
                          {t('None')}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                </Flex>
              </Th>
              <Th
                border="0.5px solid #D5D5D5"
                borderLeft="none"
                borderRight="none"
                onClick={() => {
                  setOrderBy(SortBy.NAME);
                  direction === Direction.ASC ? setDirection(Direction.DESC) : setDirection(Direction.ASC);
                }}
                cursor={'pointer'}
                _hover={{ textDecoration: 'underline' }}
                textDecoration={orderBy === SortBy.NAME ? 'underline' : 'none'}
                textColor={orderBy === SortBy.NAME ? '#12814b' : '#757880'}
              >
                {t('COMPANY NAME')}
                <CustomTooltip label="Only the current page will be sorted">
                  {direction === Direction.DESC ? (
                    <ChevronDownIcon
                      fontSize="17px"
                      marginLeft="10px"
                      marginBottom="3px"
                      visibility={orderBy === SortBy.NAME ? 'visible' : 'hidden'}
                    />
                  ) : (
                    <ChevronUpIcon
                      fontSize="17px"
                      marginLeft="10px"
                      marginBottom="3px"
                      visibility={orderBy === SortBy.NAME ? 'visible' : 'hidden'}
                    />
                  )}
                </CustomTooltip>
              </Th>
              <Th
                border="0.5px solid #D5D5D5"
                borderLeft="none"
                borderRight="none"
                textDecoration={'none'}
                textColor={'#757880'}
              >
                {t('STATUS')}
              </Th>
              <Th
                border="0.5px solid #D5D5D5"
                borderLeft="none"
                borderRight="none"
                onClick={() => {
                  setOrderBy(SortBy.SCORE);
                  direction === Direction.ASC ? setDirection(Direction.DESC) : setDirection(Direction.ASC);
                }}
                cursor={'pointer'}
                _hover={{ textDecoration: 'underline' }}
                textDecoration={orderBy === SortBy.SCORE ? 'underline' : 'none'}
                textColor={orderBy === SortBy.SCORE ? '#12814b' : '#757880'}
              >
                {t('SCORE')}
                <CustomTooltip label="Only the current page will be sorted">
                  {direction === Direction.DESC ? (
                    <ChevronDownIcon
                      fontSize="17px"
                      marginLeft="10px"
                      marginBottom="3px"
                      visibility={orderBy === SortBy.SCORE ? 'visible' : 'hidden'}
                    />
                  ) : (
                    <ChevronUpIcon
                      fontSize="17px"
                      marginLeft="10px"
                      marginBottom="3px"
                      visibility={orderBy === SortBy.SCORE ? 'visible' : 'hidden'}
                    />
                  )}
                </CustomTooltip>
              </Th>
              <Th border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none" />
            </Tr>
          </Thead>
        )}
        <Tbody>
          {loading ? (
            <LoadingScreen />
          ) : (
            companies.map((company: any) => (
              <Tr className="companyRow" key={company.id} cursor="pointer" _hover={{ bg: '#F6F6F6' }}>
                <Td border="0.5px solid #D5D5D5" borderLeft="none">
                  <CompanyListActions
                    company={company}
                    filters={filters}
                    direction={direction}
                    orderBy={orderBy}
                    limit={limit}
                    page={page}
                    additionalFilters={additionalFilters}
                    isChecked={
                      bulkSelected.findIndex((object) => {
                        return object.id === company.id;
                      }) > -1
                    }
                    onCheckboxChange={(val: boolean) => {
                      const newSelection: CompanyWithCheck[] = val
                        ? [
                            ...bulkSelected,
                            {
                              id: company.id,
                              isFavorite: company.tenantCompanyRelation.isFavorite,
                              isInternal: company.tenantCompanyRelation.type === ViewIdType.INTERNAL ? true : false,
                            },
                          ]
                        : bulkSelected.filter((element) => element.id !== company.id);
                      setBulkSelected(newSelection);
                    }}
                  />
                </Td>
                <Td
                  border="0.5px solid #D5D5D5"
                  borderLeft="none"
                  borderRight="none"
                  onClick={() => handleSort(company.id)}
                >
                  <Text as="h3" textStyle="h3">
                    {getCompanyName(company)}
                  </Text>
                </Td>
                <Td
                  border="0.5px solid #D5D5D5"
                  borderLeft="none"
                  borderRight="none"
                  onClick={() => handleSort(company.id)}
                >
                  <StatusLabel
                    status={company.tenantCompanyRelation?.status}
                    type={company.tenantCompanyRelation?.type}
                  />
                </Td>
                <Td width={'10%'} border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none">
                  {company.stimulusScore?.results?.[0].scoreValue.toFixed() ?? '-'}
                </Td>
                <Td
                  border="0.5px solid #D5D5D5"
                  borderLeft="none"
                  borderRight="none"
                  onClick={() => {
                    handleOpenDialogo(company);
                  }}
                >
                  {checkTypeOfView(viewId) === ViewIdType.CUSTOM && (
                    <DeleteIcon color={'#767675'} className="deleteIconCompany" />
                  )}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      <AlertDialogCustom
        openAndClose={isOpenDialog}
        cancelRef={cancelRef}
        toClose={handleCloseDialogo}
        toNext={handleDeleteFronTheList}
      />
      {!!discoverCompanies?.count === false && !loading && <NoResultBox />}
    </Box>
  );
};

const StatusLabel = (props: { status: string; type: string }) => {
  const { status, type } = props;
  const { t } = useTranslation();
  const label = type === 'external' ? type : status;
  const { bg, color, fill, border } = useMemo(() => {
    switch (label) {
      case 'active':
        return { bg: '#E7F7EF', fill: '#13AC5A', color: '#007A39' };
      case 'inactive':
        return { bg: '#FCF4F5', fill: '#E6949E', color: '#C62F40' };
      case 'external':
        return { bg: 'white', border: '.5px solid #2A2A28', fill: 'transparent', color: 'primary' };
      case 'archived':
      default:
        return { bg: '#F1F1F1', fill: '#717171', color: '#717171' };
    }
  }, [label]);
  return (
    <Tooltip
      label={type === 'external' ? t('Add to Internal') : status === 'inactive' ? t('Archive Company') : null}
      bg="#fff"
      border="1px solid #E4E4E4"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25)"
      boxSizing="border-box"
      color="#2A2A28"
    >
      <Box bg={bg} display="inline-block" borderRadius="4px" p="0 8px">
        <Box p="1" {...(border && { border, p: '3px' })} borderRadius="50%" mr="2" display="inline-block" bg={fill} />
        <Text color={color} display="inline-block" fontSize="14" lineHeight="21px">
          {capitalizeFirstLetter(label)}
        </Text>
      </Box>
    </Tooltip>
  );
};

export default CompanyList;
