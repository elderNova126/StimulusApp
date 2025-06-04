import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Contingency } from '../company.types';
import { CompanyAccordion, FakeRightBorder } from '../shared';
import ContingenciesGrid from './ContingenciesGrid';
import ContingencyItem from './ContingencyItem';
import ContingencyItemRow from './ContingencyItemRow';

const DisplayView = (props: { contingencies: Contingency[]; isListView: boolean }) => {
  const { contingencies, isListView } = props;
  const { t } = useTranslation();
  const [index, setIndex] = useState<number>(0);
  const { length: count } = contingencies;
  const [displayOneContingency, setDisplayOneContingency] = useState<boolean>(false);

  return (
    <div data-testid="display-view">
      {isListView ? (
        <>
          <Flex>
            <Box w="48px" position="relative">
              <FakeRightBorder />
            </Box>
            <Box flex={2.5}>
              <Text as="h5" textStyle="h5" p="14px">
                {t('NAME')}
              </Text>
            </Box>
            <Box flex={1}>
              <Text as="h5" textStyle="h5" p="14px">
                {t('TYPE')}
              </Text>
            </Box>
            <Box flex={0.4}>
              <Text as="h5" textStyle="h5" p="14px">
                {t('CREATED')}
              </Text>
            </Box>
            <Box flex={1}>
              <Text as="h5" textStyle="h5" p="14px">
                {t('UPDATED')}
              </Text>
            </Box>
          </Flex>
          {count > 0 ? (
            <CompanyAccordion borderColor="#D5D5D5">
              {contingencies.map((contingency: Contingency) => (
                <ContingencyItemRow key={contingency.id} contingency={contingency} />
              ))}
            </CompanyAccordion>
          ) : (
            <Text>{t('No contingencies found.')}</Text>
          )}
        </>
      ) : count > 0 ? (
        displayOneContingency ? (
          <Stack>
            <ContingencyItem
              showContingencyGrid={() => setDisplayOneContingency(false)}
              contingency={contingencies[index]}
              index={index}
              total={count}
              next={() => setIndex((currentIndex) => currentIndex + 1)}
              prev={() => setIndex((currentIndex) => currentIndex - 1)}
            />
          </Stack>
        ) : (
          <ContingenciesGrid
            contingencies={contingencies}
            showOneContingency={(contingencyIndex: number) => {
              setDisplayOneContingency(true);
              setIndex(contingencyIndex);
            }}
          />
        )
      ) : (
        <Text>{t('No contingencies found.')}</Text>
      )}
    </div>
  );
};

export default DisplayView;
