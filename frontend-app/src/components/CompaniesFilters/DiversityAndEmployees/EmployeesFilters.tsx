import { Divider, Flex, NumberInput, NumberInputField, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  DiscoveryState,
  FilterInterval,
  setEmployeesFrom,
  setEmployeesTo,
  setRevenuePerEmployeeFrom,
  setRevenuePerEmployeeTo,
} from '../../../stores/features';

const EmployeesFilters = () => {
  const { t } = useTranslation();
  const employees: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.employees);
  const revenuePerEmployee: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.revenuePerEmployee
  );
  const dispatch = useDispatch();

  return (
    <>
      <Text as="h4" textStyle="h4">
        {t('Employees')}
      </Text>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Number of Employees')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(employees?.from)) ? employees?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setEmployeesFrom(valueAsNumber > 0 ? valueAsNumber : undefined));
          }}
          max={employees?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(employees?.to)) ? employees?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setEmployeesTo(valueAsNumber));
          }}
          min={Number(employees?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Max')} />
        </NumberInput>
      </Flex>
      <Text mt="0.5rem" as="h5" textStyle="h5" fontWeight="400" lineHeight="18px">
        {t('Revenue per employee')}
      </Text>
      <Flex alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(revenuePerEmployee?.from)) ? revenuePerEmployee?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setRevenuePerEmployeeFrom(valueAsNumber));
          }}
          max={revenuePerEmployee?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('$ Min')} />
        </NumberInput>

        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(revenuePerEmployee?.to)) ? revenuePerEmployee?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setRevenuePerEmployeeTo(valueAsNumber));
          }}
          min={Number(revenuePerEmployee?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('$ Max')} />
        </NumberInput>
      </Flex>
    </>
  );
};

export default EmployeesFilters;
