import { Box, Stack, Text, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetDashboardData, useGetReportID } from '../../hooks';
import { getMonthFullnameFromNumber } from '../../utils/date';
import { localeUSDFormat } from '../../utils/number';
import { navigate } from '@reach/router';
const ChartDash = (props: { qty: number; type: string; prev?: boolean; current?: boolean; hasData?: boolean }) => {
  const { type, qty, current } = props;
  const [timePeriodFilter, setTimePeriodFilter] = useState('current');
  const [granularityFilter, setGranularityFilter] = useState('month');

  const {
    chartData,
    loading,
    count: countDashboard,
    prevYearCount,
  } = useGetDashboardData(timePeriodFilter, granularityFilter, type);
  const { reportParam, reportName } = useGetReportID(type, 1, true);

  useEffect(() => {
    if (!current) {
      setTimePeriodFilter('previous');
    }
  }, [current]);

  return (
    <Box h="330px" border="1px solid #E4E4E4" rounded="4px">
      {loading && (
        <Box w={qty === 3 ? '340px' : qty === 2 ? '527px' : '1088px'} h="345px" textAlign="center">
          {' '}
          <Spinner my="150px" thickness="4px" speed="0.65s" emptyColor="gray.300" color="green.400" size="xl" />{' '}
        </Box>
      )}
      {!loading && (
        <>
          <Stack isInline>
            <Box>
              <Text
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
                onClick={() => navigate(`/reports/${reportParam}/1`, { state: { report: reportName } })}
                ml="5px"
                p="15px"
                fontSize="16px"
                fontWeight="600"
              >
                {`${type === 'Spent' ? localeUSDFormat(countDashboard) : countDashboard} ${type}`}
              </Text>
            </Box>
          </Stack>
          <Box w={qty === 3 ? '340px' : qty === 2 ? '527px' : '1088px'} h="230px" m="auto" p="10px">
            {countDashboard > 0 && chartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={chartData ?? []}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 30,
                    bottom: 5,
                  }}
                >
                  <XAxis
                    fontWeight="600"
                    tickLine={false}
                    axisLine={false}
                    dataKey="name"
                    fontSize="12px"
                    tick={{ fill: '#2A2A28' }}
                  />
                  <Tooltip
                    labelFormatter={(value: string) => {
                      return granularityFilter === 'month' ? getMonthFullnameFromNumber(value) : value;
                    }}
                    formatter={(value: any) => {
                      return type === 'Spent' ? localeUSDFormat(value) : value;
                    }}
                  />
                  <Line
                    type="linear"
                    strokeWidth={2}
                    dataKey={type === 'Spent' ? 'Spent' : type === 'Suppliers' ? 'Companies' : type}
                    stroke="#12814B"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box textAlign="center">
                <Text lineHeight="240px">There is no information available</Text>
              </Box>
            )}
          </Box>
          <Stack isInline spacing={-20} justifyContent="space-around" mb="3px" fontSize="11px">
            {prevYearCount > 0 || countDashboard > 0 ? (
              <Stack>
                <Box display="flex" mb="-10px">
                  {current && (
                    <Text
                      cursor="pointer"
                      fontWeight="600"
                      mx="5px"
                      color={timePeriodFilter === 'current' ? '#12814B' : 'gray.100'}
                      onClick={() => setTimePeriodFilter('current')}
                    >
                      this
                    </Text>
                  )}
                  {prevYearCount > 0 && (
                    <Text
                      cursor="pointer"
                      fontWeight="600"
                      color={timePeriodFilter === 'previous' ? '#12814B' : 'gray.100'}
                      onClick={() => setTimePeriodFilter('previous')}
                    >
                      prev
                    </Text>
                  )}
                </Box>
                <Slider
                  aria-label="slider-ex-2"
                  colorScheme=""
                  value={!current ? 50 : prevYearCount === 0 ? 50 : timePeriodFilter === 'current' ? 23 : 75}
                >
                  <SliderTrack bg="#d0eed6">
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb w="10px" h="10px" bgColor="#12814B" />
                </Slider>
              </Stack>
            ) : null}

            {prevYearCount > 0 || countDashboard > 0 ? (
              <Stack>
                <Box display="flex" mb="-10px">
                  <Text
                    cursor="pointer"
                    fontWeight="600"
                    mx="5px"
                    color={granularityFilter === 'quarter' ? '#12814B' : 'gray.100'}
                    onClick={() => setGranularityFilter('quarter')}
                  >
                    qtr
                  </Text>
                  <Text
                    cursor="pointer"
                    fontWeight="600"
                    mx="5px"
                    color={granularityFilter === 'month' ? '#12814B' : 'gray.100'}
                    onClick={() => setGranularityFilter('month')}
                  >
                    month
                  </Text>
                </Box>
                <Slider
                  aria-label="slider-ex-2"
                  colorScheme=""
                  value={granularityFilter === 'month' ? 70 : granularityFilter === 'quarter' ? 18 : 48}
                >
                  <SliderTrack bg="#d0eed6">
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb w="10px" h="10px" bgColor="#12814B" />
                </Slider>
              </Stack>
            ) : null}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default ChartDash;
