import { useQuery } from '@apollo/client';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyProjectType, ProjectStatus } from '../../../graphql/enums';
import ProjectQueries from '../../../graphql/Queries/ProjectQueries';
import { CustomTooltip } from '../../GenericComponents/CustomTooltip';
import { styleNumber, styleNumberOfResults } from '../commonStyles';
import { Company } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import { DisplayView } from './DisplayView';

const { GET_PROJECTS_BY_COMPANY } = ProjectQueries;

const InternalProjectsPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company } = props;
  const { data, loading } = useQuery(GET_PROJECTS_BY_COMPANY, {
    variables: {
      companyId: company.id,
      companyType: CompanyProjectType.AWARDED,
      statusIn: [ProjectStatus.COMPLETED],
      limit: 5,
      page: 1,
      orderBy: 'project.created',
      direction: 'DESC',
    },
    fetchPolicy: 'cache-and-network',
  });
  const [count, setcount] = useState(0);
  const projects = data?.searchProjects?.results ?? [];
  const { t } = useTranslation();

  return (
    <Stack spacing={0}>
      <Stack direction="column" spacing={4}>
        <Stack direction="row">
          <Flex>
            <Text as="h1" textStyle="h1_profile" marginRight="1.5">
              {t('Internal Projects')}
            </Text>
            <CustomTooltip label={'Projects that are completed with your organization.'}>
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
        </Stack>
        <CompanyProfileDivider />
      </Stack>
      <DisplayView projects={projects} loading={loading} setcount={setcount} />
    </Stack>
  );
});

export default InternalProjectsPanel;
