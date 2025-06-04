import { AccordionButton, AccordionItem, AccordionPanel } from '@chakra-ui/accordion';
import { Box, Center, Divider, Flex, Stack, Text } from '@chakra-ui/layout';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiChevronDown, BiChevronRight } from 'react-icons/bi';
import { Contact } from '../company.types';
import { FakeRightBorder } from '../shared';
import { parseFullName } from '../../../utils/string';

const ContactItemRow = (props: { contact: Contact }) => {
  const [open, setOpen] = useState(false);
  const { contact } = props;
  const { t } = useTranslation();
  const IconComponent = !open ? BiChevronRight : BiChevronDown;

  const parseAddress = (contact: Contact) => {
    const { addressStreet, addressStreet2, addressStreet3 } = contact;
    let address = '';
    addressStreet && (address += addressStreet);
    addressStreet2 && (address += ', ' + addressStreet2);
    addressStreet3 && (address += ', ' + addressStreet3);
    return address || '-';
  };

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
            {parseFullName(contact)}
          </Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary">{contact.email === '' ? '-' : contact.email}</Text>
          <Text textStyle="tableSubInfoSecondary">{contact.phone === '' ? '-' : contact.phone}</Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary">{t('Job Title')}</Text>
          <Text textStyle="pagination">{contact.jobTitle ?? '-'}</Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary">{contact.city ?? '-'}</Text>
        </Box>
        <Box flex={1} p="14px">
          <Text textStyle="tableSubInfoSecondary">
            {contact.type?.toLowerCase() === 'private'
              ? 'Private'
              : contact.type?.toLowerCase() === 'public'
                ? 'Public'
                : '-'}
          </Text>
        </Box>
      </Flex>
      <AccordionPanel pb={4} bg="#F6F6F6" pl="48px">
        <Stack spacing={3}>
          <Divider />
          <Flex>
            <Box flex="1">
              <Text textStyle="tableSubInfo">{t('Address')}</Text>
              <Text textStyle="tableSubInfoSecondary">{parseAddress(contact)}</Text>
            </Box>
            <Stack flex="1" spacing={4}>
              <Box>
                <Text textStyle="tableSubInfo">{t('Additional Email')}</Text>
                <Text textStyle="tableSubInfoSecondary">{contact.emailAlt ?? '-'}</Text>
              </Box>
              <Box>
                <Text textStyle="tableSubInfo">{t('Additional Phone')}</Text>
                <Text textStyle="tableSubInfoSecondary">{contact.phoneAlt ?? '-'}</Text>
              </Box>
              <Box>
                <Text textStyle="tableSubInfo">{t('Fax')}</Text>
                <Text textStyle="tableSubInfoSecondary">{contact.fax ?? '-'}</Text>
              </Box>
            </Stack>
            <Box flex="2" />
          </Flex>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ContactItemRow;
