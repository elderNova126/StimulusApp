import { Divider, Flex, NumberInput, NumberInputField, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DiscoveryState, FilterInterval, setBoardTotalFrom, setBoardTotalTo } from '../../../stores/features';

const BoardFilters = () => {
  const { t } = useTranslation();
  const boardTotal: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.boardTotal);
  const dispatch = useDispatch();

  return (
    <>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Board')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(boardTotal?.from)) ? boardTotal?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setBoardTotalFrom(valueAsNumber));
          }}
          max={boardTotal?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('% Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(boardTotal?.to)) ? boardTotal?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setBoardTotalTo(valueAsNumber));
          }}
          min={Number(boardTotal?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('% Max')} />
        </NumberInput>
      </Flex>
    </>
  );
};

export default BoardFilters;
