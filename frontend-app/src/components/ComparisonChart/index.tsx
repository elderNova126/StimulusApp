import {
  Box,
  Center,
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/table';
import MoreVert from '@material-ui/icons/MoreVert';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { getCompanyName } from '../../utils/dataMapper';
import CompanyAddActionPanel from '../CompanyAddActionPanel';
import { CompaniesDropDown } from '../ComparisonTable/CompaniesDropdown';
import GenericChart from '../GenericChart';
import withScoreData from '../GenericChart/withScoreData';
import { TdBorder } from '../ComparisonTable/TdBorder';
interface MetricSelection {
  label: string;
  mappedKey: string;
}
interface PeriodSelection {
  id: string;
  label: string;
  from: Moment;
  to: Moment;
}
const periods: PeriodSelection[] = [
  { id: '1', label: 'Last 6 Months', from: moment.utc().subtract(6, 'months'), to: moment.utc() },
  { id: '2', label: 'Last Year', from: moment.utc().subtract(12, 'months'), to: moment.utc() },
];
const metrics: MetricSelection[] = [
  { label: 'Stimulus Score', mappedKey: 'scoreValue' },
  { label: 'Quality', mappedKey: 'quality' },
  { label: 'Reliability', mappedKey: 'reliability' },
  { label: 'Features', mappedKey: 'features' },
  { label: 'Cost', mappedKey: 'cost' },
  { label: 'Relationship', mappedKey: 'relationship' },
  { label: 'Financial', mappedKey: 'financial' },
  { label: 'Diversity', mappedKey: 'diversity' },
  { label: 'Innovation', mappedKey: 'innovation' },
  { label: 'Flexibility', mappedKey: 'flexibility' },
  { label: 'Brand', mappedKey: 'brand' },
];

const ComparisonChart = (props: { data: { companies: any; loading: boolean } }) => {
  const { data } = props;
  const { companies } = data;
  const [blockedCompanies, setBlockedCompanies] = useState<any[]>([]);
  const [companiesToShow, setCompaniesToShow] = useState<any[]>(
    companies.slice(10).map(({ id }: { id: string }) => id)
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>(periods[0].id);
  const [selectedMetric, setSelectedMetric] = useState('scoreValue');

  useEffect(() => {
    setCompaniesToShow(companies.filter((c: any) => !blockedCompanies.find((id: string) => id === c.id)));
  }, [blockedCompanies, setCompaniesToShow, companies]);
  useEffect(() => {
    setBlockedCompanies(companies.slice(10).map(({ id }: { id: string }) => id));
  }, [companies]);

  const PerformanceChart = withScoreData({
    WrappedComponent: GenericChart,
    metadata: {
      companies: companiesToShow,
      metric: selectedMetric,
      period: periods.find((p) => p.id === selectedPeriod),
    },
  });
  return (
    <Stack flexShrink={1} direction="row">
      <Table height="0" variant="simple" __css={{ borderCollapse: 'separate', borderSpacing: '0px' }}>
        <Thead>
          <Tr>
            <Th
              zIndex="dropdown"
              bg="#fff"
              position="sticky"
              top="0"
              left="0"
              border="0.5px solid #D5D5D5"
              _hover={{ transform: 'scale(0.99)', bg: '#F6F6F6' }}
            >
              <Flex alignItems="center" justifyContent="space-between">
                {'Company Name'}
                <CompaniesDropDown
                  companies={companies}
                  blockedCompanies={blockedCompanies}
                  setBlockedCompanies={setBlockedCompanies}
                />
              </Flex>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {companiesToShow.map((company: any) => (
            <Tr key={company.id}>
              <CompanyNameRow
                company={company}
                hideCompany={() => {
                  if (blockedCompanies.length < companies.length - 1) {
                    setBlockedCompanies([...blockedCompanies, company.id]);
                  }
                }}
              />
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Stack direction="column" flex="2" spacing={3} marginLeft="0">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          height="66px"
          border="0.5px solid #D5D5D5"
          borderRight="0"
          transition="all .1s ease"
        >
          <Select
            size="lg"
            border="0"
            width="auto"
            value={selectedMetric}
            onChange={(e: any) => setSelectedMetric(e.target.value)}
          >
            {metrics.map((metric) => (
              <option key={metric.mappedKey} value={metric.mappedKey}>
                {metric.label}
              </option>
            ))}
          </Select>
          <Select size="sm" width="auto" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.label}
              </option>
            ))}
          </Select>
        </Stack>
        <Center>
          <Box>
            {companiesToShow.length > 0 && (
              <>
                <PerformanceChart />
                {/* <GenericChart
                data={prepareChartData(
                  chartData,
                  selectedMetric,
                  periods.find((p) => p.id === selectedPeriod)
                )}
              /> */}
              </>
            )}
          </Box>
        </Center>
      </Stack>
    </Stack>
  );
};

const CompanyNameRow = (props: { company: any; hideCompany: () => void }) => {
  const [hovered, setHovered] = useState(false);
  const { company, hideCompany } = props;

  return (
    <TdBorder onMouseOver={() => !hovered && setHovered(true)} onMouseLeave={() => setHovered(false)} maxHeight="66px">
      <Flex justifyContent="space-between">
        {getCompanyName(company)}
        <Flex visibility={hovered ? 'visible' : 'hidden'}>
          <Popover placement="right-start">
            <PopoverTrigger>
              <IconButton
                aria-label="add"
                size="xs"
                _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}
                bg="transparent"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVert />
              </IconButton>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                onClick={(e) => e.stopPropagation()}
                maxH="500px"
                overflowY="scroll"
                p="0"
                width="200px"
                borderRadius="0"
                border="1px solid #E4E4E4"
                borderColor="#E4E4E4"
                boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
              >
                <PopoverBody p="0">
                  <CompanyAddActionPanel company={company} />
                </PopoverBody>
              </PopoverContent>
            </Portal>
            <IconButton
              bg="transparent"
              _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}
              size="xs"
              aria-label="close"
              onClick={() => hideCompany()}
            >
              <IoIosCloseCircleOutline />
            </IconButton>
          </Popover>
        </Flex>
      </Flex>
    </TdBorder>
  );
};

export default ComparisonChart;
