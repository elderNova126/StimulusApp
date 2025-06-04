import { AccordionButton, AccordionItem, AccordionPanel } from '@chakra-ui/accordion';
import { Center, Divider, Flex, Text } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiChevronDown, BiChevronRight } from 'react-icons/bi';
import { utcStringToLocalDate } from '../../../utils/date';
import { Certification } from '../company.types';
import { FakeRightBorder } from '../shared';
import { getExpirationDays } from '../../../utils/companies/expirationInfo';

const CertificationItemRow = (props: { certification: Certification }) => {
  const [open, setOpen] = useState(false);
  const { certification } = props;
  const { t } = useTranslation();
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const IconComponent = !open ? BiChevronRight : BiChevronDown;

  const remainingDays = certification.remainingDays;

  const expirationInfo = useMemo(() => {
    return remainingDays ? getExpirationDays(remainingDays) : 'N/A';
  }, [remainingDays]);

  return (
    <AccordionItem>
      <Flex {...(open && { bg: '#F6F6F6' })}>
        <Center cursor="pointer" w="48px" position="relative">
          <AccordionButton onClick={() => setOpen(!open)} _hover={{ bg: 'transparent' }}>
            <IconComponent />
          </AccordionButton>
          <FakeRightBorder />
        </Center>
        <Box flex={1} p="14px">
          <Text as="h4" textStyle="h4">
            {certification.name}
          </Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary">{certification.type}</Text>
        </Box>
        <Box flex={0.4} p="14px">
          <Text textStyle="tableSubInfoSecondary">{utcStringToLocalDate(certification.certificationDate)}</Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary">{utcStringToLocalDate(certification.expirationDate)}</Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary">{certification.certificationNumber}</Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary" color={remainingDays && remainingDays < 90 ? 'red' : 'black'}>
            {expirationInfo}
          </Text>
        </Box>
      </Flex>
      <AccordionPanel pb={4} bg="#F6F6F6" pl="48px">
        <Flex flexDirection="column">
          <Divider />
          <Flex margin="1rem 0 0 1rem" width="80%">
            <Flex flex={2} flexDirection="column">
              <Text textStyle="tableSubInfo">{t('Issued By')}</Text>
              <Text textStyle="tableSubInfoSecondary">{certification.issuedBy}</Text>
            </Flex>
            <Flex flex={5} flexDirection="column">
              <Text textStyle="tableSubInfo">{t('Description')}</Text>
              <Text height={showFullDescription ? 'auto' : '36px'} overflow="hidden" textStyle="tableSubInfoSecondary">
                {certification.description}
              </Text>
              <Text
                onClick={() => setShowFullDescription((showFullDescription) => !showFullDescription)}
                textStyle="miniTextLink"
                cursor="pointer"
                margin=".5rem 0 1rem 0"
                color="#000"
              >
                {certification?.description?.length > 100
                  ? showFullDescription
                    ? t('Show Less')
                    : t('Show More')
                  : ''}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default CertificationItemRow;
