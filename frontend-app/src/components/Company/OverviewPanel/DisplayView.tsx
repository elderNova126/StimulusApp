import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CompanyUpdateState } from '../../../stores/features/company';
import { formatTotalSpend, localeUSDFormat } from '../../../utils/number';
import { ContentTrimmer } from '../../GenericComponents';
import { CustomTooltip } from '../../GenericComponents/CustomTooltip';
import { OWNERSHIP_TAGS_EMPTY_VALUE } from '../company.types';
import { CompananyOwnership } from './DisplayOwners/DisplayOwners';
import { CompanyIndustries } from './DisplayIndustries/DisplayIndustries';
import { CompanyTags } from './DisplayTags/DisplayTags';
import { CompanyNetWorks } from './DisplayNetWork.tsx/DisplayNetWorks';
import { CompanyBusinessNames } from './DisplayBusinessName/DisplayBusinessNames';
import { navigate } from '@reach/router';

const DisplayView = (props: { company: any; highlight: boolean; otherFields: boolean }) => {
  const { company, highlight, otherFields } = props;
  const employeesDiverse = useSelector((state: { company: CompanyUpdateState }) => state.company.employeesDiverse);

  const companyOwners = [
    ...(company.diverseOwnership ? company.diverseOwnership : []),
    ...(company.minorityOwnership ? company.minorityOwnership : []),
    ...(company.smallBusiness ? ['Small Business'] : []),
  ].filter((element) => element !== OWNERSHIP_TAGS_EMPTY_VALUE);

  const { t } = useTranslation();
  return (
    <Flex flexDirection={'column'}>
      <Stack m="1rem" spacing={3} data-testid="display-overview-highlights" id="display-overview-highlights">
        {highlight && (
          <Text as="h5" textStyle="h5">
            {t('Highlights')}
          </Text>
        )}
        <Flex justifyContent="space-between">
          <SimpleGrid width="100%" justifyContent="space-between" columns={4} spacing="12">
            {company.customers && (
              <Stack
                data-testid="customer-display"
                id="customer-display"
                py="1rem"
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Text as="h4" textStyle="h4" bg="gradient.iconbutton" p="4px 10px" borderRadius="15px">
                  {company.customers}
                </Text>
                <Text textStyle="body" display="inline">
                  {t('Customers')}
                </Text>
              </Stack>
            )}
            {company.tenantCompanyRelation?.type === 'internal' && (
              <>
                {company.projectsOverview?.globalSpent > 0 && (
                  <Stack
                    data-testid="global-spent-display"
                    id="global-spent-display"
                    py="1rem"
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CustomTooltip arrow={false} label={localeUSDFormat(company.projectsOverview.globalSpent)}>
                      <Text as="h4" textStyle="h4" bg="gradient.iconbutton" p="4px 10px" borderRadius="15px">
                        {formatTotalSpend(company.projectsOverview.globalSpent)}
                      </Text>
                    </CustomTooltip>
                    <Text textStyle="body" display="inline">
                      {t('Total Spent')}
                    </Text>
                  </Stack>
                )}

                {company.projectsOverview?.totalProjects > 0 && (
                  <Stack
                    data-testid="total-projects-display"
                    id="total-projects-display"
                    py="1rem"
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Text as="h4" textStyle="h4" bg="gradient.iconbutton" p="4px 10px" borderRadius="15px">
                      {company.projectsOverview.totalProjects ?? '-'}
                    </Text>
                    <Text textStyle="body" display="inline">
                      {t('Projects')}
                    </Text>
                    <CustomTooltip arrow={false} label="The number of completed projects awarded to the supplier.">
                      <Box lineHeight="1rem">
                        <InfoOutlineIcon color="gray" />
                      </Box>
                    </CustomTooltip>
                  </Stack>
                )}

                {company.projectsOverview?.totalEvaluations > 0 && (
                  <Stack
                    data-testid="evaluations-display"
                    id="evaluations-display"
                    py="1rem"
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Text as="h4" textStyle="h4" bg="gradient.iconbutton" p="4px 10px" borderRadius="15px">
                      {company.projectsOverview.totalEvaluations}
                    </Text>
                    <Text textStyle="body" display="inline">
                      {t('Evaluations')}
                    </Text>
                    <CustomTooltip arrow={false} label="The number of evaluations for completed projects.">
                      <Box lineHeight="1rem">
                        <InfoOutlineIcon color="gray" />
                      </Box>
                    </CustomTooltip>
                  </Stack>
                )}
              </>
            )}
            {!!company?.yearFounded && (
              <Stack py="1rem" direction="row" spacing={1} alignItems="center">
                <Text as="h4" textStyle="h4" bg="gradient.iconbutton" p="4px 10px" borderRadius="15px">
                  {company?.yearFounded}
                </Text>
                <Text textStyle="body" display="inline">
                  {t('Founded')}
                </Text>
              </Stack>
            )}
          </SimpleGrid>
        </Flex>
      </Stack>

      {otherFields && (
        <SimpleGrid justifyContent="space-between" columns={3} spacing="40">
          <Flex direction="column" w="320px">
            {!!company.industries && <CompanyIndustries industries={company.industries} />}
            {company.tags && <CompanyTags tags={company.tags} />}
            {company.creditScoreBusinessNo && (
              <Stack marginLeft="1rem" marginBottom="0.5rem" alignItems="flex-start">
                <Text as="h5" textStyle="h5">
                  {t('Credit Score Business Number')}
                </Text>
                <ContentTrimmer body={company.creditScoreBusinessNo} />
              </Stack>
            )}
            {company.taxIdNo && (
              <Stack marginLeft="1rem" marginBottom="0.5rem" alignItems="flex-start">
                <Text as="h5" textStyle="h5">
                  {t('Tax Identification Number')}
                </Text>
                <ContentTrimmer body={company.taxIdNo} />
              </Stack>
            )}
          </Flex>
          <Flex direction="column" w="320px">
            {companyOwners.length > 0 || employeesDiverse ? (
              <CompananyOwnership
                companyOwners={companyOwners}
                employeesDiverse={employeesDiverse}
                ownershipDescription={company.ownershipDescription}
              />
            ) : null}
            {company.operatingStatus && (
              <Stack marginLeft="1rem" marginBottom="0.5rem" alignItems="flex-start">
                <Text as="h5" textStyle="h5">
                  {t('Operating Status')}
                </Text>
                <ContentTrimmer body={company.operatingStatus} />
              </Stack>
            )}
            {company.jurisdictionOfIncorporation && (
              <Stack marginLeft="1rem" marginBottom="0.5rem" alignItems="flex-start">
                <Text as="h5" textStyle="h5">
                  {t('Jurisdiction of Incorporation')}
                </Text>
                <ContentTrimmer body={company.jurisdictionOfIncorporation} />
              </Stack>
            )}
            {company.typeOfLegalEntity && (
              <Stack marginLeft="1rem" marginBottom="0.5rem" alignItems="flex-start">
                <Text as="h5" textStyle="h5">
                  {t('Legal Entity Type')}
                </Text>
                <ContentTrimmer body={company.typeOfLegalEntity} />
              </Stack>
            )}
            {company.parentCompanyTaxId && (
              <Stack marginLeft="1rem" marginBottom="0.5rem" alignItems="flex-start">
                <Text as="h5" textStyle="h5">
                  {t('Parent Company')}
                </Text>
                <Text
                  {...(company?.parentCompany?.id && { textDecor: 'underline', cursor: 'pointer' })}
                  {...(company?.parentCompany?.id && { onClick: () => navigate(company?.parentCompany?.id) })}
                >
                  {company.parentCompanyTaxId}
                </Text>
              </Stack>
            )}
          </Flex>
          <Flex direction="column" w="320px">
            {company.description && (
              <Stack>
                <Text as="h5" textStyle="h5">
                  {t('Description')}
                </Text>
                <ContentTrimmer width="311px" body={company.description} />
              </Stack>
            )}
            {company.facebook || company.linkedin || company.twitter || company.website ? (
              <CompanyNetWorks company={company} />
            ) : null}
            {company.doingBusinessAs ||
            company.legalBusinessName ||
            company.otherBusinessNames ||
            company.previousBusinessNames ? (
              <CompanyBusinessNames company={company} />
            ) : null}
          </Flex>
        </SimpleGrid>
      )}
    </Flex>
  );
};

export default DisplayView;
