import { Box, Divider, Flex, NumberInput, NumberInputField, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  DiscoveryState,
  FilterInterval,
  setAssetsFrom,
  setAssetsPctOfRevenueFrom,
  setAssetsPctOfRevenueTo,
  setAssetsTo,
  setLiabilitiesFrom,
  setLiabilitiesPctOfRevenueFrom,
  setLiabilitiesPctOfRevenueTo,
  setLiabilitiesTo,
  setNetProfitFrom,
  setNetProfitPctFrom,
  setNetProfitPctTo,
  setNetProfitTo,
  setRevenueFrom,
  setRevenueGrowthFrom,
  setRevenueGrowthTo,
  setRevenueTo,
} from '../../stores/features';

const FinancialsFilters = () => {
  const { t } = useTranslation();

  return (
    <Box p="1.5rem" maxWidth="50vw">
      <Text pl="2" as="h2" textStyle="h2">
        {t('Financials')}
      </Text>
      <Divider m="12px 0" />
      <Flex>
        <Box flex="1" pl="2">
          <RevenueFilters />
          <NetProfitFilters />
        </Box>

        <Box flex="1" pl="5">
          <AssetsFilters />
          <LiabilitiesFilters />
        </Box>
      </Flex>
    </Box>
  );
};

export const RevenueFilters = () => {
  const { t } = useTranslation();
  const revenue: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.revenue);
  const growth: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.revenueGrowth);
  const dispatch = useDispatch();

  return (
    <>
      <Text as="h4" textStyle="h4">
        {t('Revenue')}
      </Text>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Current Year')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(revenue?.from)) ? revenue?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setRevenueFrom(valueAsNumber));
          }}
          max={revenue?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(revenue?.to)) ? revenue?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setRevenueTo(valueAsNumber));
          }}
          min={Number(revenue?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Max')} />
        </NumberInput>
      </Flex>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Growth')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(growth?.from)) ? growth?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setRevenueGrowthFrom(valueAsNumber));
          }}
          max={growth?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(growth?.to)) ? growth?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setRevenueGrowthTo(valueAsNumber));
          }}
          min={Number(growth?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Max')} />
        </NumberInput>
      </Flex>
    </>
  );
};

export const NetProfitFilters = () => {
  const { t } = useTranslation();
  const netProfit: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.netProfit);
  const netProfitPct: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.netProfitPct
  );
  const dispatch = useDispatch();
  return (
    <>
      <Text as="h4" textStyle="h4">
        {t('Net Profit')}
      </Text>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Current Year')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(netProfit.from)) ? netProfit?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setNetProfitFrom(valueAsNumber));
          }}
          max={netProfit?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(netProfit?.to)) ? netProfit?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setNetProfitTo(valueAsNumber));
          }}
          min={Number(netProfit?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Max')} />
        </NumberInput>
      </Flex>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Percentage of Revenue')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(netProfitPct.from)) ? netProfitPct?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setNetProfitPctFrom(valueAsNumber));
          }}
          max={netProfitPct?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(netProfitPct?.to)) ? netProfitPct?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setNetProfitPctTo(valueAsNumber));
          }}
          min={Number(netProfitPct?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Max')} />
        </NumberInput>
      </Flex>
    </>
  );
};

export const AssetsFilters = () => {
  const { t } = useTranslation();
  const currentYear: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.assets);
  const pctOfRevenue: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.assetsPctOfRevenue
  );
  const dispatch = useDispatch();

  return (
    <>
      <Text as="h4" textStyle="h4">
        {t('Assets')}
      </Text>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Current Year')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(currentYear.from)) ? currentYear?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setAssetsFrom(valueAsNumber));
          }}
          max={currentYear?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(currentYear?.to)) ? currentYear?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setAssetsTo(valueAsNumber));
          }}
          min={Number(currentYear?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Max')} />
        </NumberInput>
      </Flex>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Percentage of Revenue')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(pctOfRevenue.from)) ? pctOfRevenue?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setAssetsPctOfRevenueFrom(valueAsNumber));
          }}
          max={pctOfRevenue?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Min')} />
        </NumberInput>
        <Divider w="3" m="1" />

        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(pctOfRevenue?.to)) ? pctOfRevenue?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setAssetsPctOfRevenueTo(valueAsNumber));
          }}
          min={Number(pctOfRevenue?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Max')} />
        </NumberInput>
      </Flex>
    </>
  );
};

export const LiabilitiesFilters = () => {
  const { t } = useTranslation();
  const liabilities: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.liabilities
  );
  const liabilitiesPctOfRevenue: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.liabilitiesPctOfRevenue
  );
  const dispatch = useDispatch();

  return (
    <>
      <Text as="h4" textStyle="h4">
        {t('Liabilities')}
      </Text>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Current Year')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(liabilities.from)) ? liabilities?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setLiabilitiesFrom(valueAsNumber));
          }}
          max={liabilities?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(liabilities?.to)) ? liabilities?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setLiabilitiesTo(valueAsNumber));
          }}
          min={Number(liabilities?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Max')} />
        </NumberInput>
      </Flex>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Percentage of Revenue')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(liabilitiesPctOfRevenue.from)) ? liabilitiesPctOfRevenue?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setLiabilitiesPctOfRevenueFrom(valueAsNumber));
          }}
          max={liabilitiesPctOfRevenue?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(liabilitiesPctOfRevenue?.to)) ? liabilitiesPctOfRevenue?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setLiabilitiesPctOfRevenueTo(valueAsNumber));
          }}
          min={Number(liabilitiesPctOfRevenue?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Max')} />
        </NumberInput>
      </Flex>
    </>
  );
};

export default FinancialsFilters;
