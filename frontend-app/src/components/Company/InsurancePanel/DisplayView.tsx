import { ArrowUpDownIcon } from '@chakra-ui/icons';
import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Insurance } from '../company.types';
import { CompanyAccordion, FakeRightBorder } from '../shared';
import InsuranceItem from './InsuranceItem';
import InsuranceItemRow from './InsuranceItemRow';
import InsurancesGrid from './InsurancesGrid';

const DisplayView = (props: { insurances: Insurance[]; isGridView: boolean }) => {
  const { t } = useTranslation();
  const { insurances, isGridView } = props;
  const { length: count } = insurances;
  const [index, setIndex] = useState(0);
  const [displayOneInsurance, setDisplayOneInsurance] = useState<boolean>(false);

  const [insurancesSorted, setInsurancesSorted] = useState(insurances);
  const [sortType, setSortType] = useState('name');
  const [order, setOrder] = useState<any>(false);

  useEffect(() => {
    setInsurancesSorted([...(insurances ?? [])]);
  }, [insurances]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sortArray = (type: any) => {
      switch (type) {
        case 'coverageLimit':
          return setInsurancesSorted(
            [...insurancesSorted].sort((a, b) => {
              const valueA: number = a.coverageLimit ?? 0;
              const valueB: number = b.coverageLimit ?? 0;
              return order === false ? valueA - valueB : valueB - valueA;
            })
          );
        case 'coverageStart':
          return setInsurancesSorted(
            [...insurancesSorted].sort((a, b) => {
              const valueA: any = new Date(a.coverageStart);
              const valueB: any = new Date(b.coverageStart);
              return order === false ? valueA - valueB : valueB - valueA;
            })
          );
        case 'coverageEnd':
          return setInsurancesSorted(
            [...insurancesSorted].sort((a, b) => {
              const valueA: any = new Date(a.coverageEnd);
              const valueB: any = new Date(b.coverageEnd);
              return order === false ? valueA - valueB : valueB - valueA;
            })
          );
        case 'type':
          return setInsurancesSorted(
            [...insurancesSorted].sort((a: any, b: any) => {
              const valueA: any = a.type === '';
              const valueB: any = b.type === '';

              return order === false
                ? valueA - valueB || +(a.type > b.type) || -(a.type < b.type)
                : b.type.localeCompare(a.type);
            })
          );
        case 'name':
          return setInsurancesSorted(
            [...insurancesSorted].sort((a, b) => {
              return order === false
                ? (a.name ?? '').localeCompare(b.name ?? '')
                : (b.name ?? '').localeCompare(a.name ?? '');
            })
          );
        default:
          return insurancesSorted;
      }
    };
    sortArray(sortType);
  }, [sortType, order]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setOrder(false);
  }, [sortType]); // eslint-disable-line react-hooks/exhaustive-deps

  return !isGridView ? (
    <>
      <Flex>
        <Box w="48px" position="relative">
          <FakeRightBorder />
        </Box>
        <Box
          flex={1}
          onClick={() => {
            setSortType('name');
            setOrder(!order);
          }}
        >
          <Text as="h5" textStyle="h5" p="14px" _hover={{ textDecoration: 'underline' }} cursor={'pointer'}>
            {t('NAME')}
            <ArrowUpDownIcon
              fontSize="10px"
              marginLeft="10px"
              marginBottom="3px"
              visibility={sortType === 'name' ? 'visible' : 'hidden'}
            />
          </Text>
        </Box>
        <Box
          flex={1}
          onClick={() => {
            setSortType('type');
            setOrder(!order);
          }}
        >
          <Text as="h5" textStyle="h5" p="14px" _hover={{ textDecoration: 'underline' }} cursor={'pointer'}>
            {t('TYPE')}
            <ArrowUpDownIcon
              fontSize="10px"
              marginLeft="10px"
              marginBottom="3px"
              visibility={sortType === 'type' ? 'visible' : 'hidden'}
            />
          </Text>
        </Box>
        <Box
          flex={1}
          onClick={() => {
            setSortType('coverageLimit');
            setOrder(!order);
          }}
        >
          <Text as="h5" textStyle="h5" p="14px" _hover={{ textDecoration: 'underline' }} cursor={'pointer'}>
            {t('LIMIT')}
            <ArrowUpDownIcon
              fontSize="10px"
              marginLeft="10px"
              marginBottom="3px"
              visibility={sortType === 'coverageLimit' ? 'visible' : 'hidden'}
            />
          </Text>
        </Box>
        <Box
          flex={1}
          onClick={() => {
            setSortType('coverageStart');
            setOrder(!order);
          }}
        >
          <Text as="h5" textStyle="h5" p="14px" _hover={{ textDecoration: 'underline' }} cursor={'pointer'}>
            {t('START')}
            <ArrowUpDownIcon
              fontSize="10px"
              marginLeft="10px"
              marginBottom="3px"
              visibility={sortType === 'coverageStart' ? 'visible' : 'hidden'}
            />
          </Text>
        </Box>
        <Box
          flex={1}
          onClick={() => {
            setSortType('coverageEnd');
            setOrder(!order);
          }}
        >
          <Text as="h5" textStyle="h5" p="14px" _hover={{ textDecoration: 'underline' }} cursor={'pointer'}>
            {t('END')}
            <ArrowUpDownIcon
              fontSize="10px"
              marginLeft="10px"
              marginBottom="3px"
              visibility={sortType === 'coverageEnd' ? 'visible' : 'hidden'}
            />
          </Text>
        </Box>
        <Box flex={1}>
          <Text as="h5" textStyle="h5" p="14px">
            {t('EXPIRES IN')}
          </Text>
        </Box>
      </Flex>
      {count > 0 ? (
        <CompanyAccordion borderColor="#D5D5D5">
          {insurancesSorted.map((insurance: Insurance) => (
            <InsuranceItemRow key={insurance.id} insurance={insurance} />
          ))}
        </CompanyAccordion>
      ) : (
        <Text>{t('No insurances found.')}</Text>
      )}
    </>
  ) : count > 0 ? (
    displayOneInsurance ? (
      <Stack>
        <InsuranceItem
          showInsuranceGrid={() => setDisplayOneInsurance(false)}
          insurance={insurances[index]}
          index={index}
          total={count}
          next={() => setIndex((currentIndex) => currentIndex + 1)}
          prev={() => setIndex((currentIndex) => currentIndex - 1)}
        />
      </Stack>
    ) : (
      <InsurancesGrid
        insurances={insurances}
        showOneInsurance={(insuranceIndex) => {
          setDisplayOneInsurance(true);
          setIndex(insuranceIndex);
        }}
      />
    )
  ) : (
    <Text>{t('No insurances found.')}</Text>
  );
};

export default DisplayView;
