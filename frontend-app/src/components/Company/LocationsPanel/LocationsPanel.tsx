import { Flex, Stack, Text } from '@chakra-ui/layout';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styleNumber, styleNumberOfResults } from '../commonStyles';
import { Company } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import DisplayView from './DisplayView';
import UpdateView from './UpdateView';

const LocationsPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { t } = useTranslation();
  const { company, edit } = props;
  const [count, setcount] = useState(0);

  useEffect(() => {
    if (company.locations?.results) {
      setcount(company.locations?.results.length);
    }
  }, [company]);

  return (
    <Stack spacing={0} id="locations">
      <Stack direction="column" spacing={4}>
        <Flex>
          <Text as="h1" textStyle="h1_profile">
            {t('Locations')}
          </Text>
          {count > 0 && (
            <Flex sx={styleNumberOfResults} marginTop="-0.5%">
              <Text sx={styleNumber}>{count}</Text>
            </Flex>
          )}
        </Flex>
        <CompanyProfileDivider />
      </Stack>
      {edit ? <UpdateView ref={ref} company={company} /> : <DisplayView company={company} />}
    </Stack>
  );
});

export default LocationsPanel;
