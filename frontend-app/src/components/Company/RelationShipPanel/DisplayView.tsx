import { Box, Flex, SimpleGrid, Text, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CompanyUpdateState } from '../../../stores/features/company';
import { formatTotalSpend, localeUSDFormat } from '../../../utils/number';
import { ContentTrimmer } from '../../GenericComponents';
import { Company, ClassifiedCompanyByType } from '../company.types';
import { PieChartRelationship } from './PieChart';
import CommentsSection from './Comments/CommentsSection';
import RectangleOfCircles from './RectangleOfCircles/RectangleOfCircles';
import { CustomTooltip } from '../../GenericComponents/CustomTooltip';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import BadgeDisplay from './Badges/BadgeDisplay';
import { Badge } from '../../CompanyAccount/Badges/badge.types';
import { supplierText, tierText, StackGeneralStyle } from './styles';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
import { InternalProject } from '../../../graphql/types';

const DisplayView = (props: {
  company: Company;
  highlight: boolean;
  comments: any;
  showComments: boolean;
  commentsLoading: boolean;
  completedProjects: number;
  inProgressProjects: number;
  classifiedCompanyByType: ClassifiedCompanyByType;
  firstProjectStartDate?: number;
  badges: Badge[];
  projects: InternalProject[];
  projectsLoading: boolean;
}) => {
  const {
    comments,
    company,
    completedProjects,
    inProgressProjects,
    classifiedCompanyByType,
    firstProjectStartDate,
    badges,
    projects,
    projectsLoading,
  } = props;
  const { count, results } = classifiedCompanyByType;
  const { t } = useTranslation();
  const companyInternalName = useSelector(
    (state: { company: CompanyUpdateState }) => state.company?.tenantCompanyRelation?.internalName
  );
  const companyInternalId = useSelector(
    (state: { company: CompanyUpdateState }) => state.company?.tenantCompanyRelation?.internalId
  );

  const calculateRectangleOfCirclesOptions = () => {
    const total = (completedProjects || 0) + (inProgressProjects || 0);
    const options = [
      { color: '#11814b', percentage: ((completedProjects || 0) / total) * 100 },
      { color: '#ffd601', percentage: ((inProgressProjects || 0) / total) * 100 },
    ];
    return options;
  };

  return (
    <>
      <Stack m="1rem !important">
        <Flex mb="20px">
          <SimpleGrid columns={4} spacing={{ base: '48', md: '28' }} w="90%">
            <CommentsSection company={company ?? []} comments={comments ?? []} />
            {!!company?.tenantCompanyRelation?.internalName && (
              <Box my="10px" data-testid="internalNameDisplay">
                <Text as="h5" textStyle="h5">
                  {t('Internal Name')}
                </Text>
                <div className="overflowHidden">
                  <ContentTrimmer
                    height="120px"
                    body={companyInternalName}
                    id={'internalNameDisplay'}
                    fontSize={'18px'}
                  />
                </div>
              </Box>
            )}
            {!!company?.tenantCompanyRelation?.internalId && (
              <Box my="10px">
                <Text as="h5" textStyle="h5">
                  {t('Internal ID')}
                </Text>
                <div className="overflowHidden">
                  <ContentTrimmer height="120px" body={companyInternalId} id={'internalIdDisplay'} fontSize={'18px'} />
                </div>
              </Box>
            )}
          </SimpleGrid>
        </Flex>
        <SimpleGrid columns={4} spacing={{ md: '10' }} w="96%">
          {!!(company?.projectsOverview?.accountSpent || company.tenantCompanyRelation?.supplierTier) && (
            <Box my="10px">
              <Text as="h5" textStyle="h5">
                {t('General')}
              </Text>
              <Box>
                {!!company.tenantCompanyRelation?.supplierTier && (
                  <>
                    <Stack sx={StackGeneralStyle}>
                      <Text sx={tierText} id="tier-value">
                        Tier {company?.tenantCompanyRelation?.supplierTier}
                      </Text>
                      <Flex display={'flex'} flexDirection={'column'} marginRight={10}>
                        <Text sx={supplierText}>{'Supplier'}</Text>
                        {!!firstProjectStartDate && (
                          <Text textStyle="pagination" id="since-value">
                            {t(`Since ${firstProjectStartDate}`)}
                          </Text>
                        )}
                      </Flex>
                      <Stack />
                    </Stack>
                  </>
                )}
                {!!company?.projectsOverview?.accountSpent && (
                  <Box marginLeft="58px">
                    <CustomTooltip arrow={false} label={localeUSDFormat(company.projectsOverview.accountSpent)}>
                      <Text fontSize={'18px'} fontWeight={400} width={'10rem'}>
                        {`${formatTotalSpend(company.projectsOverview.accountSpent)} USD`}
                      </Text>
                    </CustomTooltip>
                    <Flex>
                      <Text textStyle="pagination">Lifetime Expenditures</Text>
                      <CustomTooltip arrow={false} label={'Total spend for completed projects.'}>
                        <Box lineHeight="1rem" mt="-2px" ml="1.5">
                          <InfoOutlineIcon color="gray" />
                        </Box>
                      </CustomTooltip>
                    </Flex>
                  </Box>
                )}
              </Box>
            </Box>
          )}
          {!!(completedProjects > 0 || inProgressProjects > 0) && (
            <Box display="flex" flexDirection="row" alignContent={'center'}>
              <Box my="10px">
                <Flex>
                  <Text as="h5" textStyle="h5" mb="4px">
                    {t('Projects')}
                  </Text>
                  <CustomTooltip arrow={false} label={'The number of projects completed and in progress.'}>
                    <Box lineHeight="1rem" mt="-2px" ml="1.5">
                      <InfoOutlineIcon color="gray" />
                    </Box>
                  </CustomTooltip>
                </Flex>
                <Flex wrap="wrap">
                  {!projectsLoading && (
                    <Box>
                      <Text fontSize={'18px'}>
                        {projects && projects[0]
                          ? new Date(projects[0].startDate).toLocaleDateString('en-US', {
                              month: '2-digit',
                              day: '2-digit',
                              year: 'numeric',
                            })
                          : 'NA'}
                      </Text>
                      <Text textStyle="pagination">Started</Text>
                      <Text fontSize={'18px'}>
                        {projects && projects[0]
                          ? new Date().getFullYear() - new Date(projects[0].startDate).getFullYear()
                          : 0}
                      </Text>
                      <Text textStyle="pagination">Of years</Text>
                    </Box>
                  )}
                  <Box mx="1rem" mb="1rem">
                    <Text fontSize={'18px'}>{completedProjects ?? 0}</Text>
                    <Text textStyle="pagination">Completed</Text>
                    <Text fontSize={'18px'}>{inProgressProjects ?? 0}</Text>
                    <Text textStyle="pagination">In progress</Text>
                  </Box>
                  <Box>
                    <RectangleOfCircles
                      circlesPerLine={5}
                      numLines={5}
                      options={calculateRectangleOfCirclesOptions()}
                    />
                  </Box>
                </Flex>
              </Box>
            </Box>
          )}
          {!!(count && count > 0) && (
            <Box my="10px">
              <Flex>
                <Text as="h5" textStyle="h5">
                  {t('Internal Selection Status')}
                </Text>
                <CustomTooltip
                  arrow={false}
                  label={'The number of projects (in -progress and completed) by selection status.'}
                >
                  <Box lineHeight="1rem" mt="-2px" ml="1.5">
                    <InfoOutlineIcon color="gray" />
                  </Box>
                </CustomTooltip>
              </Flex>
              <PieChartRelationship dataChart={results} />
            </Box>
          )}
          <BadgeDisplay badges={badges} tenantCompanyRelationshipId={company?.tenantCompanyRelation.id} />
        </SimpleGrid>
      </Stack>
    </>
  );
};

export default withLDConsumer()(DisplayView) as any;
