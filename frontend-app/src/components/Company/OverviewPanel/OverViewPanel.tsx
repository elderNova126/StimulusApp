import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomTooltip } from '../../GenericComponents/CustomTooltip';
import { Company } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import DisplayView from './DisplayView';
import UpdatePanel from './UpdatePanel';

const OverviewPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company, edit } = props;
  const [highlight, setHighlight] = useState<boolean>(false);
  const [otherFields, setOtherFields] = useState(false);
  const [header, setHeader] = useState(false);

  useEffect(() => {
    if (
      company.customers ||
      company.projectsOverview?.totalProjects > 0 ||
      company.projectsOverview?.globalSpent > 0 ||
      company.yearFounded ||
      company.projectsOverview?.totalEvaluations > 0
    ) {
      setHighlight(true);
    }
    if (
      company.tags ||
      !!company?.diverseOwnership?.length ||
      company.industries ||
      company.description ||
      company.facebook ||
      company.twitter ||
      company.linkedin ||
      company.website ||
      company.parentCompany ||
      company.legalBusinessName ||
      company.doingBusinessAs ||
      company.previousBusinessNames ||
      company.otherBusinessNames ||
      company.operatingStatus ||
      company.jurisdictionOfIncorporation ||
      company.typeOfLegalEntity ||
      company.creditScoreBusinessNo ||
      company.taxIdNo
    ) {
      setOtherFields(true);
    }
  }, [company, edit]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (otherFields || highlight) {
      setHeader(true);
    }
  }, [otherFields, highlight, company]);

  const { t } = useTranslation();

  return (
    <Box>
      {header || edit ? (
        <Stack spacing={edit ? 0 : 5} id="overview">
          <Stack direction="column" spacing={4}>
            <Flex>
              <Text as="h1" textStyle="h1_profile" marginRight="1.5">
                {t('Overview')}
              </Text>
              <CustomTooltip arrow={false} label={'This section provides details on the supplier at the global level.'}>
                <Box lineHeight="2rem">
                  <InfoOutlineIcon color="gray" />
                </Box>
              </CustomTooltip>
            </Flex>
            <CompanyProfileDivider />
          </Stack>
          {edit ? (
            <UpdatePanel company={company} />
          ) : (
            <DisplayView company={company} highlight={highlight} otherFields={otherFields} />
          )}
        </Stack>
      ) : null}
    </Box>
  );
});

export default OverviewPanel;
