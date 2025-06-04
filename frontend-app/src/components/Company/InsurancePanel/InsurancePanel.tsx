import { Icon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdClose } from 'react-icons/io';
import { CustomTooltip } from '../../GenericComponents/CustomTooltip';
import { styleNumber, styleNumberOfResults } from '../commonStyles';
import { Company, Insurance } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import DisplayView from './DisplayView';
import InsuranceFilters from './InsuranceFilters';
import UpdateView from './UpdateView';
import { calculateRemainingDays } from '../../../utils/companies/expirationInfo';
import CompanyAttachments, { CompanyAttachmentTypes } from '../AttachmentsPanel/CompanyAttachments';
import StimButton from '../../ReusableComponents/Button';

const InsurancePanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company, edit } = props;

  const insurances = useMemo<Insurance[]>(() => {
    const insurances = company.insuranceCoverage?.results ?? [];
    return insurances.map((insurance) => {
      if (insurance.coverageEnd) {
        const remainingDays = calculateRemainingDays(insurance.coverageEnd);
        return { ...insurance, remainingDays };
      }
      return { ...insurance, remainingDays: null };
    });
  }, [company]);

  const { t } = useTranslation();
  const [isGridView, setIsGridView] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [count, setcount] = useState(0);

  useEffect(() => {
    if (company.insuranceCoverage?.results) {
      setcount(company.insuranceCoverage?.results.length);
    }
  }, [company]);

  const filteredInsurances = useMemo(
    () => insurances.filter((insurance) => selectedTypes.includes(insurance.type)),
    [insurances, selectedTypes]
  );

  const availableTypes = useMemo(
    () => Array.from(new Set((insurances || []).map((insurance) => insurance.type))),
    [insurances]
  );

  return (
    <Stack spacing={0} id="insurance">
      <Stack direction="column" spacing={4}>
        <Stack direction="row">
          <Flex>
            <Text as="h1" textStyle="h1_profile" marginRight="1.5">
              {t('Insurance')}
            </Text>
            <CustomTooltip
              label={
                'Insurances that are available for the company including workers compensation, property, casualty, tax insurance, etc.'
              }
            >
              <Box lineHeight="2rem">
                <InfoOutlineIcon color="gray" />
              </Box>
            </CustomTooltip>
            {count > 0 && (
              <Flex sx={styleNumberOfResults} marginTop="-2.5%">
                <Text sx={styleNumber}>{count}</Text>
              </Flex>
            )}
          </Flex>
          <Flex flexDirection="row" position="absolute" right="3rem">
            <InsuranceFilters
              isOpen={isFiltersOpen}
              setIsOpen={setIsFiltersOpen}
              count={selectedTypes.length ? filteredInsurances.length : undefined}
              filterHook={[selectedTypes, setSelectedTypes]}
              availableTypes={availableTypes}
            />
            <StimButton
              onClick={() => setIsGridView(true)}
              size="stimSmall"
              colorScheme="gradient.iconbutton"
              variant={isGridView ? 'stimPrimary' : 'stimTextButton'}
            >
              {t('Grid View')}
              {isGridView && (
                <Icon
                  data-testid="grid-view-close-icon"
                  fontSize="12px"
                  margin="7px 0 7px 7px"
                  as={IoMdClose}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsGridView(false);
                  }}
                />
              )}
            </StimButton>
          </Flex>
        </Stack>
        <CompanyProfileDivider />
      </Stack>
      {edit ? (
        <UpdateView
          ref={ref}
          companyId={company.id}
          insurances={selectedTypes.length ? filteredInsurances : insurances}
        />
      ) : (
        <DisplayView isGridView={isGridView} insurances={selectedTypes.length ? filteredInsurances : insurances} />
      )}
      <Box my="10px !important" data-testid="insurance-attachment">
        <Text as="h5" textStyle="h5" mb="1">
          {t('Attachments')}
        </Text>
        <CompanyAttachments company={company} type={CompanyAttachmentTypes.INSURANCE} />
      </Box>
    </Stack>
  );
});

export default InsurancePanel;
