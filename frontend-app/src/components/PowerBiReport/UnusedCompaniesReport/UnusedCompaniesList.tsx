import { useLazyQuery } from '@apollo/client';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useMediaQuery,
} from '@chakra-ui/react';
import { navigate, RouteComponentProps, useParams } from '@reach/router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsThreeDots } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Direction, SortBy } from '../../../graphql/enums';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';
import { useViewIdFilter } from '../../../hooks';
import { DiscoveryState, setindexList, setListName, setReduxCount } from '../../../stores/features';
import { setLimitReports } from '../../../stores/features/generalData';
import { capitalizeFirstLetter, getCompanyName } from '../../../utils/dataMapper';
import { Company } from '../../Company/company.types';
import CompanyListActions from '../../CompanyListActions';
import CompanyListBulkActions from '../../CompanyListBulkActions';
import { Pagination } from '../../GenericComponents';
import { CustomTooltip } from '../../GenericComponents/CustomTooltip';
import NoResultBox from '../../NotFound/NoResultsBox';
import DatePicker from './DatePicker';
import LoadingScreen from '../../LoadingScreen';

const { SEARCH_UNUSED_COMPANIES } = CompanyQueries;

export interface CompanyWithCheck {
  id: string;
  isFavorite: boolean;
  isInternal: boolean;
}

const UnusedCompanyList = (props: RouteComponentProps & { viewId: string; setPageUnused: (page: number) => void }) => {
  const params = useParams();
  const limitList = useSelector((state: any) => state.generalData.limit.reports);
  const [page, setPage] = useState(Number(params?.page));

  const [limit, setLimit] = useState(limitList);
  const [direction] = useState(Direction.ASC);
  const [orderBy] = useState(SortBy.NAME);
  const [bulkSelected, setBulkSelected] = useState<CompanyWithCheck[]>([]);
  const [optionSelected, setOptionSelected] = useState('None');
  const { viewId, setPageUnused } = props;
  const filters: any = useSelector((state: { discovery: DiscoveryState }) => state.discovery.variables);
  const { t } = useTranslation();
  const additionalFilters = useViewIdFilter(viewId, null);
  const dispatch = useDispatch();
  const date = new Date();
  const [startDate, setStartDate] = useState(new Date(date.setFullYear(date.getFullYear() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [csv, setCsv] = useState('');
  const [isLargerThan1200] = useMediaQuery('(min-width: 1220px)');

  const [getUnusedCompanies, { loading: loadingCompanies, data }] = useLazyQuery(SEARCH_UNUSED_COMPANIES, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => setBulkSelected([]), [viewId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(setLimitReports(limit));
  }, [limit]);

  useEffect(() => {
    getUnusedCompanies({
      variables: { page, limit, direction, orderBy, createdFrom: startDate, createdTo: endDate },
    });
    setSortType('status');
  }, [page, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPage(Number(params.page));
    setPageUnused(page);
  }, [params]);

  useEffect(() => {
    if (optionSelected === 'All') {
      getUnusedCompanies({
        variables: {
          page: 1,
          direction,
          orderBy,
          ...additionalFilters,
          limit: 500,
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

  const [companies, setCompanies] = useState(data?.searchUnusedCompanies?.results ?? []);
  const [sortType, setSortType] = useState('status');
  const [reverse, setReverse] = useState(false);

  const defaultSort = [...(data?.searchUnusedCompanies?.results ?? [])].sort((a, b) => {
    const order: any = { active: 1, inactive: 2, external: 3, archived: 4 };
    const sorting = (a: any, b: any) => ((a > b) as any) - ((a < b) as any);
    const firstValue: string =
      order[a.tenantCompanyRelation?.type === 'external' ? 'external' : a.tenantCompanyRelation?.status];
    const secondValue: string =
      order[b.tenantCompanyRelation?.type === 'external' ? 'external' : b.tenantCompanyRelation?.status];
    return sorting(firstValue, secondValue) || sorting(a.legalBusinessName, b.legalBusinessName);
  });

  useEffect(() => {
    setCompanies(defaultSort);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (optionSelected === 'All') {
      if (data?.searchUnusedCompanies?.results?.length > 0) {
        setBulkSelected(
          Array.from(
            new Set([
              ...(data?.searchUnusedCompanies?.results ?? []).map((company: any) => {
                return {
                  id: company.id,
                  isFavorite: company.tenantCompanyRelation.isFavorite,
                  isInternal: company.tenantCompanyRelation.type === 'internal' ? true : false,
                };
              }),
            ])
          )
        );
      }
    } else {
      setBulkSelected([]);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sortArray = (type: any) => {
      switch (type) {
        case 'legalBusinessName':
          return setCompanies(
            [...companies].sort((a, b) =>
              !reverse
                ? a.legalBusinessName.localeCompare(b.legalBusinessName)
                : b.legalBusinessName.localeCompare(a.legalBusinessName)
            )
          );
        case 'score':
          return setCompanies(
            [...companies].sort((a, b) =>
              !reverse
                ? b.stimulusScore?.results?.[0].scoreValue - a.stimulusScore?.results?.[0].scoreValue
                : a.stimulusScore?.results?.[0].scoreValue - b.stimulusScore?.results?.[0].scoreValue
            )
          );
        case 'status':
          return setCompanies(defaultSort);
        default:
          return companies;
      }
    };
    sortArray(sortType);
  }, [sortType, page, reverse]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setReverse(false);
  }, [sortType]); // eslint-disable-line react-hooks/exhaustive-deps

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
    dispatch(setReduxCount(data?.searchUnusedCompanies?.count ?? 0));
    navigate(`/company/${companiId}`, {
      state: { breadcrumb: { name: t('Companies'), href: '/companiesv2' } },
    });
  };

  const selectAll = () => {
    setOptionSelected('All');
  };

  const loading = companies.length === 0 && loadingCompanies;
  const bulkIconSrc = useMemo(() => {
    for (const company of companies) {
      if (bulkSelected.indexOf(company.id) < 0) {
        return bulkSelected.length > 0 ? 'checked' : 'unchecked';
      }
    }
    return companies.length > 0 ? 'checked' : 'unchecked';
  }, [companies, bulkSelected]);

  const csvList = companies?.map((company: Company) => ({
    ID: company.id,
    'Legal Business Name': company.legalBusinessName.replace(',', '-'),
    'Doing Business As': company.doingBusinessAs ?? '',
    Score: company.stimulusScore.results[0].scoreValue,
    Status: company.tenantCompanyRelation.status,
  }));

  useEffect(() => {
    if (csvList) {
      const header = Object?.keys(csvList[0] ?? '')?.join(',');
      const values = csvList?.map((o: any) => Object?.values(o).join(',')).join('\n');
      setCsv('data:text/csv;charset=utf-8,' + header + '\n' + values);
    }
  }, [companies]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box pr="1.5rem" mt="10px" w="auto">
      <Box p=".25rem 0">
        <Stack direction="row-reverse" justify="space-between">
          <Box>
            {optionSelected === 'All' ? (
              <Pagination
                pathname="/reports/Unused%20Companies/"
                page={page}
                loading={loading}
                count={data?.searchUnusedCompanies?.count ?? 0}
                rowsPerPageOptions={[5, 10, 50, 100, 500]}
                onChangePage={setPage}
                onChangeRowsPerPage={setLimit}
                rowsPerPage={data?.searchUnusedCompanies?.count}
              />
            ) : (
              <Pagination
                pathname="/reports/Unused%20Companies/"
                page={page}
                loading={loading}
                count={data?.searchUnusedCompanies?.count ?? 0}
                rowsPerPageOptions={[5, 10, 50, 100, 500]}
                onChangePage={setPage}
                onChangeRowsPerPage={setLimit}
                rowsPerPage={limit}
              />
            )}
          </Box>
          <Stack isInline={true} direction="row-reverse" pt="5px">
            <Stack isInline={true}>
              <DatePicker setDate={setStartDate} date={startDate} placement="bottom-end" />
              <DatePicker setDate={setEndDate} date={endDate} placement="bottom-start" />
            </Stack>
            {bulkSelected.length > 0 && (
              <CompanyListBulkActions
                reports={true}
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
        </Stack>
        <Box ml={isLargerThan1200 ? '950px' : '750px'} position="relative">
          <Popover>
            <PopoverTrigger>
              <Box cursor="pointer" _hover={{ bg: 'menu.company_category' }} p="4px 4px" borderRadius="full">
                <BsThreeDots />
              </Box>
            </PopoverTrigger>
            <PopoverContent
              width="auto"
              p="4px"
              border="1px solid"
              borderColor="#BEBEBE"
              rounded="sm"
              boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25);"
            >
              <Box
                w="160px"
                px="5px"
                display="flex"
                cursor="pointer"
                onClick={() => {
                  const encodedUri = encodeURI(csv);
                  window.open(encodedUri);
                }}
              >
                <Image w="20px" h="18px" src={'/icons/download_icon.png'} ml="30px" />
                <Text fontSize="13px" fontFamily="arial">
                  Export data
                </Text>
              </Box>
            </PopoverContent>
          </Popover>
        </Box>
      </Box>
      <Box maxH={'540px'} overflow="scroll">
        <Table variant="simple" size="sm">
          {data?.searchUnusedCompanies?.count > 0 && (
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
                            isDisabled={data?.searchUnusedCompanies?.count > 500}
                            onClick={() => {
                              selectAll();
                            }}
                            _hover={{ color: data?.searchUnusedCompanies?.count < 500 && 'white' }}
                          >
                            {t('All')}
                          </MenuItem>
                          <MenuItem
                            fontWeight={'bold'}
                            _hover={{ color: 'white' }}
                            onClick={() => {
                              setOptionSelected('visible');
                              let toVisible = companies.map((company: any) => {
                                return {
                                  id: company.id,
                                  isFavorite: company.tenantCompanyRelation.isFavorite,
                                  isInternal: company.tenantCompanyRelation.type === 'internal' ? true : false,
                                };
                              });
                              if (viewId === 'all') {
                                toVisible = toVisible.slice(0, limit);
                                setCompanies(companies.slice(0, limit));
                              }
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
                    setSortType('legalBusinessName');
                    setReverse(!reverse);
                  }}
                  cursor={'pointer'}
                  _hover={{ textDecoration: 'underline' }}
                  textDecoration={sortType === 'legalBusinessName' ? 'underline' : 'none'}
                  textColor={sortType === 'legalBusinessName' ? '#12814b' : '#757880'}
                >
                  {t('COMPANY NAME')}
                  <CustomTooltip label="Only the current page will be sorted">
                    {reverse ? (
                      <ChevronDownIcon
                        fontSize="17px"
                        marginLeft="10px"
                        marginBottom="3px"
                        visibility={sortType === 'legalBusinessName' ? 'visible' : 'hidden'}
                      />
                    ) : (
                      <ChevronUpIcon
                        fontSize="17px"
                        marginLeft="10px"
                        marginBottom="3px"
                        visibility={sortType === 'legalBusinessName' ? 'visible' : 'hidden'}
                      />
                    )}
                  </CustomTooltip>
                </Th>
                <Th
                  border="0.5px solid #D5D5D5"
                  borderLeft="none"
                  borderRight="none"
                  onClick={() => setSortType('status')}
                  cursor={'pointer'}
                  _hover={{ textDecoration: 'underline' }}
                  textDecoration={sortType === 'status' ? 'underline' : 'none'}
                  textColor={sortType === 'status' ? '#12814b' : '#757880'}
                >
                  {t('STATUS')}
                  <CustomTooltip label="Only the current page will be sorted">
                    {reverse ? (
                      <ChevronDownIcon
                        fontSize="17px"
                        marginLeft="10px"
                        marginBottom="3px"
                        visibility={sortType === 'status' ? 'visible' : 'hidden'}
                      />
                    ) : (
                      <ChevronUpIcon
                        fontSize="17px"
                        marginLeft="10px"
                        marginBottom="3px"
                        visibility={sortType === 'status' ? 'visible' : 'hidden'}
                      />
                    )}
                  </CustomTooltip>
                </Th>
                <Th
                  border="0.5px solid #D5D5D5"
                  borderLeft="none"
                  borderRight="none"
                  onClick={() => {
                    setSortType('score');
                    setReverse(!reverse);
                  }}
                  cursor={'pointer'}
                  _hover={{ textDecoration: 'underline' }}
                  textDecoration={sortType === 'score' ? 'underline' : 'none'}
                  textColor={sortType === 'score' ? '#12814b' : '#757880'}
                >
                  {t('SCORE')}
                  <CustomTooltip label="Only the current page will be sorted">
                    {reverse ? (
                      <ChevronDownIcon
                        fontSize="17px"
                        marginLeft="10px"
                        marginBottom="3px"
                        visibility={sortType === 'score' ? 'visible' : 'hidden'}
                      />
                    ) : (
                      <ChevronUpIcon
                        fontSize="17px"
                        marginLeft="10px"
                        marginBottom="3px"
                        visibility={sortType === 'score' ? 'visible' : 'hidden'}
                      />
                    )}
                  </CustomTooltip>
                </Th>
              </Tr>
            </Thead>
          )}
          <Tbody>
            {loading ? (
              <LoadingScreen />
            ) : (
              companies.map((company: any) => (
                <Tr key={company.id} cursor="pointer" _hover={{ bg: '#F6F6F6' }} onClick={() => handleSort(company.id)}>
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
                                isInternal: company.tenantCompanyRelation.type === 'internal' ? true : false,
                              },
                            ]
                          : bulkSelected.filter((element) => element.id !== company.id);
                        setBulkSelected(newSelection);
                      }}
                    />
                  </Td>
                  <Td border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none">
                    <Text as="h3" textStyle="h3">
                      {getCompanyName(company)}
                    </Text>
                  </Td>
                  <Td border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none">
                    <StatusLabel
                      status={company.tenantCompanyRelation?.status}
                      type={company.tenantCompanyRelation?.type}
                    />
                  </Td>
                  <Td border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none">
                    {company.stimulusScore?.results?.[0].scoreValue.toFixed() ?? '-'}
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
      {!!data?.searchUnusedCompanies?.count === false && !loading && <NoResultBox />}
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

export default UnusedCompanyList;
