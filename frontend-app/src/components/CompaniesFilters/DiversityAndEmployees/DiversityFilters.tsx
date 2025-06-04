import { Flex, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DiscoveryState, setDiverseOwnership } from '../../../stores/features';
import { Checkbox } from '../../GenericComponents';
import { useQuery } from '@apollo/client';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';

const { GET_COMPANY_DIVERSE_OWNERSHIP } = CompanyQueries;

const DiversityFilters = () => {
  const { t } = useTranslation();
  const diverseOwnership = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.diverseOwnership);
  const dispatch = useDispatch();
  const handleToggleItem = (target: string) => {
    const newItems =
      diverseOwnership.indexOf(target) > -1
        ? diverseOwnership.filter((item) => item !== target)
        : [...diverseOwnership, target];
    dispatch(setDiverseOwnership(newItems));
  };
  const { data: cachedDiverseOwnership } = useQuery(GET_COMPANY_DIVERSE_OWNERSHIP, {
    fetchPolicy: 'cache-first',
  });
  const availableDiverseOwnership =
    cachedDiverseOwnership?.getCompanyDistinctDiverseOwnership?.diverseOwnership?.filter(
      (ownership: string) => ownership !== 'Immigrant'
    ) ?? [];
  const halfLength = Math.ceil(availableDiverseOwnership.length / 2);
  const firstItems = availableDiverseOwnership.slice(0, halfLength);
  const remainingItems = availableDiverseOwnership.slice(halfLength);

  return (
    <>
      <Text as="h4" textStyle="h4">
        {t('Ownership')}
      </Text>
      <Flex direction="row" mt=".5rem">
        <Stack flex={1} spacing={3} direction="column">
          {firstItems.map((item: string) => (
            <Stack direction="row" alignItems="center" key={item} onClick={() => handleToggleItem(item)}>
              <Checkbox checked={diverseOwnership.indexOf(item) > -1} />
              <Text textStyle="body">{t(item)}</Text>
            </Stack>
          ))}
        </Stack>
        <Stack flex={1} spacing={3} direction="column">
          {remainingItems.map((item: string) => (
            <Stack direction="row" alignItems="center" key={item} onClick={() => handleToggleItem(item)}>
              <Checkbox checked={diverseOwnership.indexOf(item) > -1} />
              <Text textStyle="body">{t(item)}</Text>
            </Stack>
          ))}
        </Stack>
      </Flex>
    </>
  );
};

export default DiversityFilters;
