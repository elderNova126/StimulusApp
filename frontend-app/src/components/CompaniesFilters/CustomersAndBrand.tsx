import { Box, Divider, Flex, NumberInput, NumberInputField, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  DiscoveryState,
  FilterInterval,
  setCustomersFrom,
  setCustomersTo,
  setFacebookFollowersFrom,
  setFacebookFollowersTo,
  setLinkedInFollowersFrom,
  setLinkedInFollowersTo,
  setNetPromoterScoreFrom,
  setNetPromoterScoreTo,
  setTwitterFollowersFrom,
  setTwitterFollowersTo,
} from '../../stores/features';

const CustomersAndBrandFilters = () => {
  const { t } = useTranslation();

  return (
    <Box p="1.5rem" maxWidth="50vw">
      <Text as="h2" textStyle="h2">
        {t('Customers & Brand')}
      </Text>
      <Divider m="12px 0" />
      <Flex>
        <Box flex="1">
          <CustomersFilter />
        </Box>
        <Box flex="2" pl="10">
          <BrandFilters />
        </Box>
      </Flex>
    </Box>
  );
};

export const CustomersFilter = () => {
  const { t } = useTranslation();
  const customers: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.customers);
  const dispatch = useDispatch();

  return (
    <>
      <Text as="h4" textStyle="h4">
        {t('Customers')}
      </Text>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Current Customers')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(customers.from)) ? customers?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setCustomersFrom(valueAsNumber));
          }}
          max={customers?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(customers?.to)) ? customers?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setCustomersTo(valueAsNumber));
          }}
          min={Number(customers?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Max')} />
        </NumberInput>
      </Flex>
    </>
  );
};

export const BrandFilters = () => {
  const { t } = useTranslation();
  const netPromoterScore: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.netPromoterScore
  );
  const twitterFollowers: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.twitterFollowers
  );
  const facebookFollowers: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.facebookFollowers
  );
  const linkedInFollowers: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.linkedInFollowers
  );
  const dispatch = useDispatch();

  return (
    <Stack direction="row" spacing={10}>
      <Box>
        <Text as="h4" textStyle="h4">
          {t('Brand')}
        </Text>
        <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
          {t('Net Promoter Score')}
        </Text>
        <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(netPromoterScore.from)) ? netPromoterScore?.from : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setNetPromoterScoreFrom(valueAsNumber));
            }}
            max={netPromoterScore?.to}
            min={Number(0)}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Min')} />
          </NumberInput>
          <Divider w="3" m="1" />

          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(netPromoterScore?.to)) ? netPromoterScore?.to : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setNetPromoterScoreTo(valueAsNumber));
            }}
            min={Number(netPromoterScore?.from)}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Max')} />
          </NumberInput>
        </Flex>
        <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
          {t('Twitter Followers')}
        </Text>
        <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(twitterFollowers.from)) ? twitterFollowers?.from : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setTwitterFollowersFrom(valueAsNumber));
            }}
            max={twitterFollowers?.to}
            min={Number(0)}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Min')} />
          </NumberInput>
          <Divider w="3" m="1" />
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(twitterFollowers?.to)) ? twitterFollowers?.to : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setTwitterFollowersTo(valueAsNumber));
            }}
            min={Number(twitterFollowers?.from)}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Max')} />
          </NumberInput>
        </Flex>
      </Box>
      <Box>
        <Text mt="28px" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
          {t('Linkedin Followers')}
        </Text>
        <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
          {/* <Input
            value={linkedInFollowers?.from ?? ''}
            onChange={(e) => {
              dispatch(setLinkedInFollowersFrom(parseInt(e.target.value, 10)));
            }}
            bg="#fff"
            type="number"
            size="sm"
            borderRadius="4px"
            flex="1"
            border="1px solid #848484"
            placeholder="Min"
          /> */}
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(linkedInFollowers.from)) ? linkedInFollowers?.from : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setLinkedInFollowersFrom(valueAsNumber));
            }}
            max={linkedInFollowers?.to}
            min={Number(0)}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Min')} />
          </NumberInput>
          <Divider w="3" m="1" />
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(linkedInFollowers?.to)) ? linkedInFollowers?.to : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setLinkedInFollowersTo(valueAsNumber));
            }}
            min={Number(linkedInFollowers?.from)}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Max')} />
          </NumberInput>
        </Flex>
        <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
          {t('Facebook Followers')}
        </Text>
        <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(facebookFollowers.from)) ? facebookFollowers?.from : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setFacebookFollowersFrom(valueAsNumber));
            }}
            max={facebookFollowers?.to}
            min={Number(0)}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Min')} />
          </NumberInput>
          <Divider w="3" m="1" />
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(facebookFollowers?.to)) ? facebookFollowers?.to : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setFacebookFollowersTo(valueAsNumber));
            }}
            min={Number(facebookFollowers?.from)}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Max')} />
          </NumberInput>
        </Flex>
      </Box>
    </Stack>
  );
};

export default CustomersAndBrandFilters;
