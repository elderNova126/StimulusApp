import { Flex, Stack, Text } from '@chakra-ui/layout';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Company } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import UpdateView from './UpdateView';
import DisplayView from './DisplayView';

const CustomersPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company, edit } = props;
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (
      company?.customers ||
      company?.netPromoterScore ||
      company?.twitterFollowers ||
      company?.facebookFollowers ||
      company?.linkedInFollowers
    ) {
      setShow(true);
    }
  }, [company, edit]);

  return (
    <Stack spacing={edit ? 0 : 5} id="customers">
      {show || edit ? (
        <>
          <Stack direction="column" spacing={4}>
            <Text as="h1" textStyle="h1_profile">
              {t('Customers & Brand')}
            </Text>
            <CompanyProfileDivider />
          </Stack>
          <Flex w="80%">{edit ? <UpdateView /> : <DisplayView company={company} />}</Flex>
        </>
      ) : undefined}
    </Stack>
  );
});

export default CustomersPanel;
