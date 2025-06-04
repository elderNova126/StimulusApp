import { Divider, Flex, NumberInput, NumberInputField, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  DiscoveryState,
  FilterInterval,
  setLeadershipTeamTotalFrom,
  setLeadershipTeamTotalTo,
} from '../../../stores/features';

const LeadershipFilters = () => {
  const { t } = useTranslation();
  const leadershipTeamTotal: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.leadershipTeamTotal
  );
  const dispatch = useDispatch();

  return (
    <>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Leadership')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(leadershipTeamTotal?.from)) ? leadershipTeamTotal?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setLeadershipTeamTotalFrom(valueAsNumber));
          }}
          max={leadershipTeamTotal?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('% Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(leadershipTeamTotal?.to)) ? leadershipTeamTotal?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setLeadershipTeamTotalTo(valueAsNumber));
          }}
          min={Number(leadershipTeamTotal?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('% Max')} />
        </NumberInput>
      </Flex>
    </>
  );
};

export default LeadershipFilters;
