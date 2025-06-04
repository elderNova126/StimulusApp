import { useQuery } from '@apollo/client';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { forwardRef, useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';
import { Company } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import DisplayView from './DisplayView';
import UpdateView from './UpdateView';
import { TenantCompanyContext } from '../../../context/TenantCompany';
import { CustomTooltip } from '../../GenericComponents/CustomTooltip';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { useBadgeRelationshipQuery } from '../../Company/RelationShipPanel/Badges/hooksBadgeRelationships';
import ProjectQueries from '../../../graphql/Queries/ProjectQueries';
import { CompanyProjectType, ProjectStatus } from '../../../graphql/enums';
import CompanyAttachments, { CompanyAttachmentTypes } from '../AttachmentsPanel/CompanyAttachments';

const { COMPANY_NOTES_GQL, RELATIONSHIP_PANEL_INFO } = CompanyQueries;
const { GET_PROJECTS_BY_COMPANY } = ProjectQueries;

const RelationshipPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company, edit } = props;
  const [highlight, setHighlight] = useState(true);
  const [badgesRelationship, setBadgesRelationship] = useState([]);
  const [showComments] = useState(false);
  const { t } = useTranslation();
  const projectData = useQuery(GET_PROJECTS_BY_COMPANY, {
    variables: {
      companyId: company.id,
      companyType: CompanyProjectType.AWARDED,
      statusIn: [ProjectStatus.COMPLETED, ProjectStatus.INPROGRESS],
      limit: 5,
      page: 1,
      orderBy: 'project.startDate',
      direction: 'ASC',
    },
    fetchPolicy: 'cache-and-network',
  });
  const projects = projectData?.data?.searchProjects?.results ?? [];
  const projectsLoading = projectData?.loading;

  const { tenantCompany } = useContext(TenantCompanyContext);
  const tenantId: string = tenantCompany?.id ?? '';

  const { loading: commentsLoading, data } = useQuery(COMPANY_NOTES_GQL(company?.id?.toString() as string), {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'network-only',
  });
  const comments = data?.companyNotes?.results;
  const { data: status } = useQuery(RELATIONSHIP_PANEL_INFO, {
    variables: {
      companyId: company.id,
    },
    fetchPolicy: 'cache-first',
  });

  const { getBadges, data: badges } = useBadgeRelationshipQuery(company ?? [], setBadgesRelationship);

  useEffect(() => {
    getBadges();
  }, [edit]);

  const [firstProjectDate] = useState<number | null>();

  const classifiedByStatus = status?.RelationShipPanelInfo?.projectStatusClassification?.results ?? {};
  const classifiedCompanyByType = status?.RelationShipPanelInfo?.CompanyTypeClassification ?? {};
  useEffect(() => {
    if (
      !!company.tenantCompanyRelation?.internalId ||
      !!company.tenantCompanyRelation?.internalName ||
      !!company.projectsOverview.accountSpent ||
      !!classifiedByStatus
    ) {
      setHighlight(true);
    }
  }, [edit]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {tenantId !== company?.id && (
        <Box id="relationships">
          <Stack spacing={edit ? 0 : 5}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Flex>
                <Text as="h1" textStyle="h1_profile" marginRight="1.5">
                  {t('Relationship')}
                </Text>
                <CustomTooltip
                  arrow={false}
                  label={'This section provides details on the supplier at the account level.'}
                >
                  <Box lineHeight="2rem">
                    <InfoOutlineIcon color="gray" />
                  </Box>
                </CustomTooltip>
              </Flex>
            </Stack>
            <CompanyProfileDivider />
            {edit ? (
              <UpdateView ref={ref} company={company} badges={badges?.badges?.results ?? []} />
            ) : (
              <DisplayView
                completedProjects={classifiedByStatus.COMPLETED}
                inProgressProjects={classifiedByStatus.INPROGRESS}
                projects={projects}
                projectsLoading={projectsLoading}
                company={company}
                highlight={highlight}
                showComments={showComments}
                comments={comments}
                commentsLoading={commentsLoading}
                classifiedCompanyByType={classifiedCompanyByType}
                {...(firstProjectDate && { firstProjectStartDate: firstProjectDate })}
                badges={badgesRelationship ?? []}
              />
            )}
            <Box m="16px !important" mb="0 !important" data-testid="relationship-attachment">
              <Text as="h5" textStyle="h5" mb="1">
                {t('Attachments')}
              </Text>
              <CompanyAttachments company={company} type={CompanyAttachmentTypes.RELATIONSHIP} />
            </Box>
          </Stack>
        </Box>
      )}
    </>
  );
});

export default RelationshipPanel;
