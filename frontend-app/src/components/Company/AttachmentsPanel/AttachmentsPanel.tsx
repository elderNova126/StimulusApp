import { Stack, Text, Flex, forwardRef } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CompanyProfileDivider } from '../shared';
import { Company } from '../company.types';
import CompanyAttachments from './CompanyAttachments';

const AttachmentsPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { t } = useTranslation();
  const { company } = props;

  return (
    <Stack>
      <Stack direction="column" spacing={4}>
        <Stack direction="row">
          <Flex>
            <Text as="h1" textStyle="h1_profile" marginRight="1.5">
              {t('Attachments')}
            </Text>
          </Flex>
        </Stack>
        <CompanyProfileDivider />
        <CompanyAttachments company={company} />
      </Stack>
    </Stack>
  );
});

export default AttachmentsPanel;
