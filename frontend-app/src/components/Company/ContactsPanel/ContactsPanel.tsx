import { Flex, Stack, Text } from '@chakra-ui/layout';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styleNumber, styleNumberOfResults } from '../commonStyles';
import { Company } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import UpdateView from './UpdateView';
import DisplayView from './DisplayView';

const ContactsPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company, edit } = props;
  const [count, setcount] = useState(0);

  useEffect(() => {
    if (company.contacts.results) {
      setcount(company.contacts.results.length);
    }
  }, [company]);

  const { t } = useTranslation();
  return (
    <Stack spacing={0} id="contacts">
      <Stack direction="column" spacing={4}>
        <Flex>
          <Text as="h1" textStyle="h1_profile" marginRight="0.5%">
            {t('Contacts')}
          </Text>
          {count > 0 && (
            <Flex sx={styleNumberOfResults}>
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

export default ContactsPanel;
