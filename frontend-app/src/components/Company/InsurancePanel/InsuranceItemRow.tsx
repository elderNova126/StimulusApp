import { AccordionButton, AccordionItem, AccordionPanel } from '@chakra-ui/accordion';
import { Box, Center, Divider, Flex, Stack, Text } from '@chakra-ui/layout';
import { useMemo, useState } from 'react';
import { BiChevronDown, BiChevronRight } from 'react-icons/bi';
import { utcStringToLocalDate } from '../../../utils/date';
import { localeUSDFormat } from '../../../utils/number';
import { Insurance } from '../company.types';
import { FakeRightBorder } from '../shared';
import { getExpirationDays } from '../../../utils/companies/expirationInfo';

const InsuranceItemRow = (props: { insurance: Insurance }) => {
  const [open, setOpen] = useState(false);
  const { insurance } = props;

  const IconComponent = !open ? BiChevronRight : BiChevronDown;
  const remainingDays = insurance.remainingDays;

  const expirationInfo = useMemo(() => {
    return remainingDays ? getExpirationDays(remainingDays) : '';
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
            {insurance.name}
          </Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary">{insurance.type === '' ? '-' : insurance.type}</Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary">{localeUSDFormat(insurance.coverageLimit)}</Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary">{utcStringToLocalDate(insurance.coverageStart)}</Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary">{utcStringToLocalDate(insurance.coverageEnd)}</Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary" color={remainingDays && remainingDays < 90 ? 'red' : 'black'}>
            {expirationInfo}
          </Text>
        </Box>
      </Flex>
      <AccordionPanel pb={4} bg="#F6F6F6" pl="48px">
        <Stack spacing={3}>
          <Divider />
          <Flex>CONTENT</Flex>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};
export default InsuranceItemRow;
