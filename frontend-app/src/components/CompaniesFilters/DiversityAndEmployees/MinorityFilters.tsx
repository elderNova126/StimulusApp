import { Flex, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DiscoveryState, setMinorityOwnership, MinorityOwnership } from '../../../stores/features';
import { Checkbox } from '../../GenericComponents';
import { useQuery } from '@apollo/client';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';

const { GET_MINORITY_OWNERSHIP_DETAIL } = CompanyQueries;

const MinorityFilters = () => {
  const { t } = useTranslation();
  const minorityOwnership = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.minorityOwnership);
  const dispatch = useDispatch();
  const handleToggleItem = (target: string) => {
    const newItems =
      minorityOwnership.indexOf(target) > -1
        ? minorityOwnership.filter((item) => item !== target)
        : [...minorityOwnership, target];
    dispatch(setMinorityOwnership(newItems));
  };
  const { data: cachedMinoryOwnership } = useQuery(GET_MINORITY_OWNERSHIP_DETAIL, {
    fetchPolicy: 'cache-first',
  });
  const availableMinorityOwnership = cachedMinoryOwnership?.getMinorityOwnership ?? [];

  const halfLength = Math.ceil(availableMinorityOwnership.length / 2);
  const firstItems = availableMinorityOwnership.slice(0, halfLength);
  const remainingItems = availableMinorityOwnership.slice(halfLength);

  return (
    <>
      <Text as="h4" mt="0.5rem" textStyle="h4">
        {t('Ownership Type')}
      </Text>
      <Flex direction="row" mt=".5rem">
        <Stack flex={1} spacing={3} direction="column">
          {firstItems.map((item: MinorityOwnership) => (
            <Stack
              direction="row"
              alignItems="center"
              key={item?.id}
              onClick={() => handleToggleItem(item?.minorityOwnershipDetail)}
            >
              <Checkbox checked={minorityOwnership.indexOf(item?.minorityOwnershipDetail) > -1} />
              <Text textStyle="body">{t(item?.displayName)}</Text>
            </Stack>
          ))}
        </Stack>
        <Stack flex={1} spacing={3} direction="column">
          {remainingItems.map((item: MinorityOwnership) => (
            <Stack
              direction="row"
              alignItems="center"
              key={item?.id}
              onClick={() => handleToggleItem(item?.minorityOwnershipDetail)}
            >
              <Checkbox checked={minorityOwnership.indexOf(item?.minorityOwnershipDetail) > -1} />
              <Text textStyle="body">{t(item?.displayName)}</Text>
            </Stack>
          ))}
        </Stack>
      </Flex>
    </>
  );
};

export default MinorityFilters;
