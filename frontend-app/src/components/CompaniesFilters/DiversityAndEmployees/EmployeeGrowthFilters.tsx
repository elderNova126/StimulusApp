import { Divider, Flex, NumberInput, NumberInputField, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DiscoveryState, FilterInterval, setEmployeesGrowthFrom, setEmployeesGrowthTo } from '../../../stores/features';

const EmployeeGrowthFilters = () => {
  const { t } = useTranslation();
  const employeesGrowth: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.employeesGrowth
  );
  const dispatch = useDispatch();

  return (
    <>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Employees')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(employeesGrowth?.from)) ? employeesGrowth?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setEmployeesGrowthFrom(valueAsNumber));
          }}
          max={employeesGrowth?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('% Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(employeesGrowth?.to)) ? employeesGrowth?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setEmployeesGrowthTo(valueAsNumber));
          }}
          min={Number(employeesGrowth?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('% Max')} />
        </NumberInput>
      </Flex>
    </>
  );
};

export default EmployeeGrowthFilters;
