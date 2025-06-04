import { UpDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Fade,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
  Tooltip,
  Image,
  Center,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { getCompanyName } from '../../utils/dataMapper';
import { localeUSDFormat } from '../../utils/number';
import CompanyListBulkActions from '../CompanyListBulkActions';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  containerDropdown,
  styleCompanyDropdown,
  containerBulkCompaniesCompare,
  tableBox,
  ThCompareTable,
  flexContainerCompanyName,
  menuBoxCheckbox,
  textMarkedCompanies,
  menuListCheckbox,
  menuListItemCheckbox,
  companyNameText,
  upDownIconStyle,
  tableActionHeader,
  bodyActionHeader,
  tdBorder,
} from './styles';
import { TdBorder } from './TdBorder';
import { ActionHeader } from './ActionHeader';
import { CompaniesDropDown } from './CompaniesDropdown';
import { MetricDropDown } from './MetricDropdown';

export const COMPARE_FIELDS: any = {
  scoreValue: 'Score Value',
  cost: 'Cost',
  brand: 'Brand',
  financial: 'Financial',
  quality: 'Quality',
  features: 'Features',
  diversity: 'Diversity',
  relationship: 'Relationship',
  flexibility: 'Flexibility',
  innovation: 'Innovation',
  reliability: 'Reliability',
  revenue: 'Revenue',
  accountSpent: 'Account Spent',
  globalSpent: 'Global Spent',
  accountProjects: 'Account Projects',
  totalProjects: 'Global Projects',
  diverseOwnership: 'Diverse Ownership',
};

const ComparisonTable = (props: { transposeTable: boolean; data: { companies: any; loading: boolean } }) => {
  const { transposeTable, data } = props;
  const { companies, loading } = data;
  const [headers, setHeaders] = useState(Object.keys(COMPARE_FIELDS));
  const [blockedCompanies, setBlockedCompanies] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>('legalBusinessName');
  const [sortDirection, setSortDirection] = useState<number>(1);
  const [sortedCompanies, setSortedCompanies] = useState([]);
  const [markedCompanies, setMarkedCompanies] = useState<string[]>([]);
  const [isLargerThan1400] = useMediaQuery('(min-width: 1400px)');
  const { t } = useTranslation();
  const hideMetric = (metric: string) => {
    setHeaders(headers.filter((m) => m !== metric));
  };
  const hideCompany = (companyId?: string) => {
    companyId && setBlockedCompanies([...blockedCompanies, companyId]);
  };

  useEffect(() => {
    const filteredCompanies: any = companies.filter((c: any) => !blockedCompanies.find((id: string) => id === c.id));
    const sortedByName = filteredCompanies.sort((a: any, b: any) =>
      (a.legalBusinessName ?? a.doingBusinessAs).localeCompare(b.legalBusinessName ?? b.doingBusinessAs)
    );

    if (sortBy === 'legalBusinessName' && sortDirection === 1) {
      setSortedCompanies(sortedByName);
    } else if (sortBy === 'legalBusinessName' && sortDirection === -1) {
      setSortedCompanies(sortedByName.reverse());
    } else {
      setSortedCompanies(
        filteredCompanies.slice(0).sort((a: any, b: any) => {
          const aMetric = a?.[sortBy];
          const bMetric = b?.[sortBy];

          const aMetricForNull: any = aMetric === null;
          const bMetricForNull: any = bMetric === null;

          return sortDirection === 1
            ? aMetricForNull - bMetricForNull || +(aMetric > bMetric) || -(aMetric < bMetric)
            : bMetric - aMetric;
        })
      );
    }
  }, [sortBy, sortDirection, companies, blockedCompanies]);

  const { tableHeaders, tableBody } = useMemo(() => {
    let tableBody: any;
    let tableHeaders: any;

    if (transposeTable) {
      tableHeaders = sortedCompanies.map((company: any) => ({
        name: getCompanyName(company),
        isMetric: false,
        company,
        checked: markedCompanies.indexOf(company.id) > -1,
        onCheckClick: () => {
          setMarkedCompanies((markedCompanies) =>
            markedCompanies.indexOf(company.id) > -1
              ? markedCompanies.filter((id) => id !== company.id)
              : [...markedCompanies, company.id]
          );
        },
      }));
      tableBody = headers.map((metric: any) => ({
        header: { name: metric, isMetric: true },
        items: sortedCompanies.map((company: any) => company?.[metric]),
      }));
    } else {
      tableHeaders = headers.map((name: string) => ({ name, /* details: 'test details',*/ isMetric: true }));
      tableBody = sortedCompanies.map((company: any) => ({
        header: {
          name: getCompanyName(company),
          isMetric: false,
          company,
          checked: markedCompanies.indexOf(company.id) > -1,
          onCheckClick: () => {
            setMarkedCompanies((markedCompanies) =>
              markedCompanies.indexOf(company.id) > -1
                ? markedCompanies.filter((id) => id !== company.id)
                : [...markedCompanies, company.id]
            );
          },
        },
        items: headers.map((metric: any) => {
          return metric === 'diverseOwnership' ? company?.[metric]?.join(', ')?.toString() : company?.[metric];
        }),
      }));
    }
    return { tableBody, tableHeaders };
  }, [sortedCompanies, transposeTable, headers, setMarkedCompanies, markedCompanies]);

  const [optionSelected, setOptionSelected] = useState('none');
  const [bulkCompanies, setBulkCompanies] = useState([]);

  useEffect(() => {
    if (optionSelected === 'none') {
      setMarkedCompanies([]);
      setBulkCompanies([]);
    }
    if (optionSelected === 'all') {
      const ids: string[] = [];
      const companiesDisplayed = companies.filter((company: any) => {
        return !blockedCompanies.includes(company.id);
      });
      const companiesChecked = companiesDisplayed.map((company: any) => {
        ids.push(company.id);
        return {
          id: company.id,
          isFavorite: company.tenantCompanyRelation.isFavorite,
          isInternal: company.tenantCompanyRelation.type === 'internal' ? true : false,
        };
      });
      setBulkCompanies(companiesChecked);
      setMarkedCompanies(ids);
    }
    if (optionSelected === 'visible') {
      const companiesDisplayed = companies.filter((company: any) => {
        return !blockedCompanies.includes(company.id);
      });
      const ids: string[] = [];
      const companiesChecked = companiesDisplayed.map((company: any) => {
        ids.push(company.id);
        return {
          id: company.id,
          isFavorite: company.tenantCompanyRelation.isFavorite,
          isInternal: company.tenantCompanyRelation.type === 'internal' ? true : false,
        };
      });

      setBulkCompanies(companiesChecked);
      setMarkedCompanies(ids);
    }
  }, [optionSelected, blockedCompanies]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const checked = tableBody
      .filter((checked: any) => checked.header.checked === true)
      .map((company: any) => {
        return {
          id: company.header.company.id,
          isFavorite: company.header.company.tenantCompanyRelation.isFavorite,
          isInternal: company.header.company.tenantCompanyRelation.type === 'internal' ? true : false,
        };
      });
    setBulkCompanies(checked);
  }, [tableBody]);

  const tableBoxStyle = tableBox(isLargerThan1400);

  return (
    <Box position="relative">
      {markedCompanies.length > 0 && (
        <Box sx={containerBulkCompaniesCompare}>
          <CompanyListBulkActions
            bulkSelection={bulkCompanies}
            setBulk={setBulkCompanies}
            setBulkComparison={setMarkedCompanies}
          />
        </Box>
      )}
      {!transposeTable && (
        <Box sx={styleCompanyDropdown}>
          <CompaniesDropDown
            companies={companies}
            blockedCompanies={blockedCompanies}
            setBlockedCompanies={setBlockedCompanies}
          />
        </Box>
      )}
      <Box sx={containerDropdown}>
        {transposeTable ? (
          <CompaniesDropDown
            companies={companies}
            blockedCompanies={blockedCompanies}
            setBlockedCompanies={setBlockedCompanies}
          />
        ) : (
          <MetricDropDown
            metrics={Object.keys(COMPARE_FIELDS) as any}
            activeMetrics={headers}
            setActiveMetrics={setHeaders}
          />
        )}
      </Box>
      <Box sx={tableBoxStyle} className="fadeCompare">
        <Fade in={!loading}>
          <Table variant="simple" __css={{ borderCollapse: 'separate', borderSpacing: '0px' }} overflowX="hidden">
            <Thead>
              <Tr>
                <Th sx={ThCompareTable}>
                  <Flex sx={flexContainerCompanyName}>
                    {transposeTable ? (
                      <>
                        <Text as="h5" textStyle="h5">
                          {'Metric'}
                        </Text>
                        <MetricDropDown
                          transpose={transposeTable}
                          metrics={Object.keys(COMPARE_FIELDS) as any}
                          activeMetrics={headers}
                          setActiveMetrics={setHeaders}
                        />
                      </>
                    ) : (
                      <>
                        <Flex>
                          <Menu>
                            <Center>
                              <Box sx={menuBoxCheckbox}>
                                <MenuButton
                                  size="sm"
                                  display="flex"
                                  variant="unstyled"
                                  as={Button}
                                  leftIcon={
                                    <Flex alignItems="center">
                                      <Image
                                        width="14px"
                                        src={`/icons/checkbox_${markedCompanies.length ? 'checked' : 'unchecked'}.svg`}
                                      />
                                      <ChevronDownIcon />
                                    </Flex>
                                  }
                                >
                                  <Text sx={textMarkedCompanies}>
                                    {markedCompanies.length > 0 && markedCompanies.length}
                                  </Text>
                                </MenuButton>
                              </Box>
                            </Center>
                            <MenuList sx={menuListCheckbox}>
                              <MenuItem
                                sx={menuListItemCheckbox}
                                onClick={() => {
                                  setOptionSelected('all');
                                }}
                              >
                                {t('All')}
                              </MenuItem>
                              <MenuItem
                                sx={menuListItemCheckbox}
                                onClick={() => {
                                  setOptionSelected('visible');
                                }}
                              >
                                {t('Visible')}
                              </MenuItem>
                              <MenuItem
                                sx={menuListItemCheckbox}
                                onClick={() => {
                                  setOptionSelected('none');
                                }}
                              >
                                {t('None')}
                              </MenuItem>
                            </MenuList>
                          </Menu>
                          <Text
                            sx={companyNameText}
                            onClick={() => {
                              if (sortBy === 'legalBusinessName') {
                                setSortDirection(sortDirection === 1 ? -1 : 1);
                              } else {
                                setSortBy('legalBusinessName');
                                setSortDirection(1);
                              }
                            }}
                          >
                            {t('Company Name')}
                          </Text>
                          {'legalBusinessName' === sortBy && sortDirection !== 0 && <UpDownIcon sx={upDownIconStyle} />}
                        </Flex>
                      </>
                    )}
                  </Flex>
                </Th>
                {tableHeaders.map(
                  (header: { name: string; details?: string; isMetric: boolean; companyId?: string }) => (
                    <ActionHeader
                      key={header.name}
                      sx={tableActionHeader}
                      setSortDirection={setSortDirection}
                      sortDirection={sortDirection}
                      sortBy={sortBy as any}
                      setSortBy={setSortBy}
                      header={header}
                      hideMetric={hideMetric}
                      hideCompany={hideCompany}
                    />
                  )
                )}
              </Tr>
            </Thead>
            <Tbody>
              {tableBody.map((row: any) => {
                const { header, items } = row;

                return (
                  <Tr key={`${header.name}_${transposeTable}`}>
                    <ActionHeader
                      sx={bodyActionHeader}
                      setSortDirection={setSortDirection}
                      sortDirection={sortDirection}
                      sortBy={sortBy as any}
                      setSortBy={setSortBy}
                      header={header}
                      hideMetric={hideMetric}
                      hideCompany={hideCompany}
                    />
                    {items.map((item: string, i: number) => {
                      const tdBorderStyle = tdBorder(tableHeaders[i].name);
                      return (
                        <TdBorder key={`${header.name}_${tableHeaders[i].name}_${item}`} sx={tdBorderStyle}>
                          {tableHeaders[i].name === 'accountSpent' ||
                          tableHeaders[i].name === 'revenue' ||
                          tableHeaders[i].name === 'globalSpent' ? (
                            <Text textStyle="body" textOverflow="ellipsis">
                              {item ? `${localeUSDFormat(Number(item))}` : 'N/A'}
                            </Text>
                          ) : tableHeaders[i].name === 'diverseOwnership' ? (
                            <Tooltip label={item} visibility={item.length >= 15 ? 'visible' : 'hidden'}>
                              <Text textStyle="body" textOverflow="ellipsis">
                                {item.length >= 15 ? item.slice(0, 15) + '...' : item}
                              </Text>
                            </Tooltip>
                          ) : (
                            <Text textStyle="body" textOverflow="ellipsis">
                              {item?.length ? `${item}  ` : (item as any) === 0 ? 'N/A' : item}
                            </Text>
                          )}
                        </TdBorder>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Fade>
      </Box>
    </Box>
  );
};

export default ComparisonTable;
