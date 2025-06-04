import { Flex, Text } from '@chakra-ui/layout';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { utcStringToLocalDate } from '../../../utils/date';
import { Insurance } from '../company.types';
import { getExpirationInfo } from '../../../utils/companies/expirationInfo';

interface InsurancesGridProps {
  insurances: Insurance[];
  showOneInsurance: (insuranceIndex: number) => void;
}

const InsurancesGrid: FC<InsurancesGridProps> = ({ insurances, showOneInsurance }) => {
  const { t } = useTranslation();
  return (
    <Flex width="100%" flexWrap="wrap">
      {insurances.map((insurance, index) => (
        <Flex marginTop="1.3rem" width="25%" key={index} flexDirection="column">
          <Text as="h6" textStyle="h6" color="#000">
            {insurance.name}
          </Text>
          <Text marginTop=".5rem" textStyle="pagination">
            {insurance.type}
          </Text>
          <Text marginTop=".2rem" textStyle="tableSubInfoSecondary">
            {`${utcStringToLocalDate(insurance.coverageStart)} - ${utcStringToLocalDate(insurance.coverageEnd)}`}
          </Text>
          {!!insurance.remainingDays && (
            <Text textStyle="small" color="red" fontSize="11px">
              {insurance.remainingDays ? getExpirationInfo(insurance.remainingDays) : ''}
            </Text>
          )}
          <Text
            marginTop=".2rem"
            onClick={() => showOneInsurance(index)}
            textStyle="miniTextLink"
            cursor="pointer"
            color="#000"
          >
            {t('Show More')}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default InsurancesGrid;
