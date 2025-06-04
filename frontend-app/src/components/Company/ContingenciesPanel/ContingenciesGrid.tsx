import { Flex, Text } from '@chakra-ui/layout';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Contingency } from '../company.types';

interface ContingenciesGridProps {
  contingencies: Contingency[];
  showOneContingency: (contingencyIndex: number) => void;
}

const ContingenciesGrid: FC<ContingenciesGridProps> = ({ contingencies, showOneContingency }) => {
  const { t } = useTranslation();
  return (
    <Flex width="100%" flexWrap="wrap">
      {contingencies.map((contingency, index) => (
        <Flex marginBottom="1.3rem" width="33%" key={index} flexDirection="column">
          <Text textStyle="pagination">{contingency.type}</Text>
          <Text marginTop=".2rem" width="70%" as="h5" textStyle="h5" color="#000">
            {contingency.name}
          </Text>
          <Text
            marginTop=".2rem"
            onClick={() => showOneContingency(index)}
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

export default ContingenciesGrid;
