import { FC } from 'react';
import { Flex, Image, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ModalCreateSupplier from '../ModalCreateSupplier/ModalCreateSupplier';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
const NoResultBox: FC = () => {
  const { t } = useTranslation();

  return (
    <Flex bg="menu.company_category" h="100%" p="3rem">
      <Stack spacing={4} w="100%" pl="1.7rem">
        <Text as="h2" textStyle="h2">
          {t('0 Results Found')}
        </Text>
        <Text textStyle="body">{t('Adjust filters or search options to yield results.')}</Text>
        <ModalCreateSupplier />
      </Stack>
      <Image src="/icons/no_results_found.svg" />
    </Flex>
  );
};

export default withLDConsumer()(NoResultBox) as any;
