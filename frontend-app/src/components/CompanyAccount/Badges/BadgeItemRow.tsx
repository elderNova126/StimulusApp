import { AccordionButton, AccordionItem, AccordionPanel } from '@chakra-ui/accordion';
import { Center, Divider, Flex, Text } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiChevronDown, BiChevronRight } from 'react-icons/bi';
import { toCapitalCase } from '../../../utils/string';
import { Badge } from './badge.types';
import { FakeRightBorder } from '../../Company/shared';
import { textExpandDescription } from './styles';
import StimButton from '../../ReusableComponents/Button';

const BadgeItemRow = (props: { badge: Badge; setBadge: (data: Badge) => void }) => {
  const [open, setOpen] = useState(false);
  const { badge, setBadge } = props;
  const { t } = useTranslation();
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const IconComponent = !open ? BiChevronRight : BiChevronDown;

  return (
    <AccordionItem>
      <Flex {...(open && { bg: '#F6F6F6' })}>
        <Center cursor="pointer" w="48px" position="relative">
          <AccordionButton onClick={() => setOpen(!open)} _hover={{ bg: 'transparent' }}>
            <IconComponent />
          </AccordionButton>
          <FakeRightBorder />
        </Center>
        <Box flex={open ? 2.9 : 1.6} p="14px">
          <Text as="h4" textStyle="h4" fontWeight="bold">
            {toCapitalCase(badge.badgeName)}
          </Text>
        </Box>
        <Box flex={open ? 6.8 : 5} p="14px">
          <Text textStyle="tableSubInfoSecondary">
            {toCapitalCase(
              badge.badgeDateStatus === 'hidden'
                ? '-'
                : badge.badgeDateStatus === 'mandatory'
                  ? 'Required'
                  : badge.badgeDateStatus
            )}
          </Text>
        </Box>
        {open && (
          <Box flex={2} p="14px" mt="-5px">
            <StimButton onClick={() => setBadge(badge)} size="stimSmall">
              {t('Edit')}
            </StimButton>
          </Box>
        )}
      </Flex>
      <AccordionPanel pb={4} bg="#F6F6F6" pl="48px">
        <Flex flexDirection="column">
          <Divider />
          <Flex margin="1rem 0 0 1rem" width="80%">
            <Flex flex={5} flexDirection="column">
              <Text textStyle="tableSubInfo">{t('Description')}</Text>
              <Text
                height={showFullDescription ? 'auto' : '36px'}
                maxW="600px"
                overflow="hidden"
                textStyle="tableSubInfoSecondary"
              >
                {badge.badgeDescription}
              </Text>
              <Text
                onClick={() => setShowFullDescription((showFullDescription) => !showFullDescription)}
                textStyle="miniTextLink"
                sx={textExpandDescription}
              >
                {badge?.badgeDescription?.length > 100 ? (showFullDescription ? t('Show Less') : t('Show More')) : ''}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default BadgeItemRow;
