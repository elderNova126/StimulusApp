import { Box, Text, Stack, Image, Flex, Tooltip } from '@chakra-ui/react';
import { Badge } from '../../../CompanyAccount/Badges/badge.types';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '../../../../utils/dataMapper';
import { InfoOutlineIcon } from '@chakra-ui/icons';
const BadgeDisplay = (props: { badges: Badge[]; tenantCompanyRelationshipId: string }) => {
  const { badges, tenantCompanyRelationshipId } = props;
  const { t } = useTranslation();
  return (
    <>
      {badges.length > 0 && (
        <Box my="10px" mx="5%" data-testid="badges-display">
          <Text as="h5" textStyle="h5">
            {t('Badges')}
          </Text>
          {badges.map((badge: Badge, index: number) => {
            const badgeRelationship =
              badge?.badgeTenantCompanyRelationships?.filter(
                (relationship: any) => relationship?.tenantCompanyRelationshipId === tenantCompanyRelationshipId
              ) ?? [];
            const badgeDate = badgeRelationship[0]?.badgeDate
              ? moment(badgeRelationship[0]?.badgeDate).format('MMM DD, YYYY')
              : '';
            return (
              <Flex
                key={index}
                w="170px"
                my="5px"
                h="48px"
                _hover={{ bg: '#F6F6F6' }}
                borderRadius="4px"
                alignItems="center"
                p="3px 3px 15px 3px"
                justify="space-between"
              >
                <Stack mt={badgeDate ? '6px' : ''} ml="5px">
                  <Flex alignItems="center">
                    <Image ml="-5px" mr="5px" width="15px" src="/icons/badge_icon.svg" />
                    <Text mt="-2px" fontSize="14px">
                      {capitalizeFirstLetter(badge.badgeName)}
                    </Text>
                  </Flex>
                  {badgeDate && (
                    <Text ml="15px !important" fontSize="11px" lineHeight="1px" fontWeight="300">
                      {badgeDate}
                    </Text>
                  )}
                </Stack>
                {badge?.badgeDescription && (
                  <Tooltip
                    sx={{
                      background: '#FFFFFF',
                    }}
                    border="1px solid #E4E4E4"
                    boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.25);"
                    boxSizing="border-box"
                    color="#2A2A28"
                    placement="top"
                    p="10px 20px 10px 20px"
                    textAlign="match-parent"
                    label={
                      <Stack maxW="420px">
                        <Text fontSize="14px" fontWeight="600">
                          {capitalizeFirstLetter(badge.badgeName)}
                        </Text>
                        {badgeDate && (
                          <Text mt="20px !important" fontSize="11px" lineHeight="1px" fontWeight="300">
                            {badgeDate}
                          </Text>
                        )}
                        <Text fontSize="12px" fontWeight="400">
                          {capitalizeFirstLetter(badge.badgeDescription)}
                        </Text>
                      </Stack>
                    }
                  >
                    <Box mt="-10px">
                      <InfoOutlineIcon color="#12814B" fontSize="12px" />
                    </Box>
                  </Tooltip>
                )}
              </Flex>
            );
          })}
        </Box>
      )}
    </>
  );
};

export default BadgeDisplay;
