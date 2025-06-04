import { useLazyQuery, useQuery } from '@apollo/client';
import { ChevronRightIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Button, HStack, Text, Tooltip, useMediaQuery } from '@chakra-ui/react';
import { RouteComponentProps, useLocation, useParams } from '@reach/router';
import { IEmbedConfiguration, models, service } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setReportPage } from '../../stores/features/generalData';
import {
  ProjectsDateFilters,
  ProjectsTenantFilters,
  SuppliersDateFilters,
  SuppliersFilters,
  TotalSpendDateFilters,
  TotalSpendFilters,
} from './ConfigFilters';

import ReportQueries from '../../graphql/Queries/ReportQueries';
import { useGetReportID } from '../../hooks';
import UnusedCompanyList from './UnusedCompaniesReport/UnusedCompaniesList';

const { GET_REPORTS, GET_EMBED_REPORT_VARIABLES } = ReportQueries;

const PowerBiReportLayout: FC<RouteComponentProps> = (RouteComponentProps) => {
  const params = useParams();
  const location: any = useLocation();
  const reportLocation = location?.state?.report;
  const { t } = useTranslation();
  const { data } = useQuery(GET_REPORTS, { fetchPolicy: 'cache-first' });
  const [getEmbedReportVariables, { data: reportVars }] = useLazyQuery(GET_EMBED_REPORT_VARIABLES, {
    fetchPolicy: 'cache-first',
  });
  const activePage = useSelector((state: any) => state.generalData.reportPage);
  const report = data?.reports?.reports?.[0];
  const [isLargerThan1200] = useMediaQuery('(min-width: 1220px)');

  const { embedToken, reportsDetail } = reportVars?.reportsParameters ?? {};
  const accessToken = embedToken?.token;
  const embedUrl = reportsDetail?.[0]?.embedUrl;

  const [page, setPage] = useState(Number(params.page));
  const { reportName } = useGetReportID(activePage, page, false);

  useEffect(() => {
    const { workspaceId, reportId } = report ?? {};
    if (workspaceId && reportId) {
      getEmbedReportVariables({
        variables: {
          workspaceId,
          reportIds: [reportId],
        },
      });
    }
  }, [report, getEmbedReportVariables]);

  if (!report || !embedUrl || !accessToken) {
    return null;
  }

  const getTooltipText = (title: string) => {
    switch (title) {
      case 'Internal Companies':
        return 'Number of internal companies over time';
      case 'Projects':
        return 'Number of projects for the time period';
      case 'Total Spend':
        return 'Total spend for the time period';
      case 'Top Industries':
        return 'Top industries by total spend';
      case 'Ownership':
        return 'Total Spend by ownership';
      case 'Unused Companies':
        return 'Companies that are not used/inactive';
    }
  };

  return (
    <Box paddingTop="2rem" w="100vw">
      <HStack justify="center" paddingRight="600px">
        <Text textStyle="tableSubInfoSecondary" fontSize="34px">
          {t('Reports')}
        </Text>
        {activePage && (
          <>
            <Box>
              <ChevronRightIcon fontWeight="400" fontSize="22px" />
            </Box>
            <Text textStyle="tableSubInfoSecondary" fontSize="34px">
              {t(activePage)}
            </Text>
            <HStack display="flex" ml="-3px !important" mt="-26px !important">
              <Tooltip
                hasArrow
                arrowShadowColor="#E0E0E0"
                label={getTooltipText(activePage)}
                bg="white"
                color="black"
                border="1px"
                borderColor="#E0E0E0"
                textAlign="center"
              >
                <Button
                  variant={'ghost'}
                  _hover={{ bg: 'white' }}
                  _active={{ bg: 'white' }}
                  padding="0 0 2px 0"
                  size={'sm'}
                >
                  <InfoOutlineIcon color="#12814B" w="19px" h="19px" />
                </Button>
              </Tooltip>
              <HStack bg="#11b2bc" borderRadius="md" w="48px" h="22px" justify="center">
                <Text color="white" p="3px 10px" fontWeight="600" fontSize="12px">
                  Beta
                </Text>
              </HStack>
            </HStack>
          </>
        )}
      </HStack>
      <Box position="relative" className="parent">
        <Box w={isLargerThan1200 ? '1200px' : '1000px'} margin="auto" className="child">
          <PowerBiReport embedUrl={embedUrl} accessToken={accessToken} reportPage={reportLocation ?? reportName} />
        </Box>
        {activePage === 'Unused Companies' && (
          <Box mt={isLargerThan1200 ? '160px' : '140px'} className="child">
            <Box w={isLargerThan1200 ? '1000px' : '800px'} h="530px" bg="white" marginX="auto">
              <UnusedCompanyList setPageUnused={setPage} viewId="internal" />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const PowerBiReport: FC<{ embedUrl: string; accessToken: string; reportPage: any }> = ({
  embedUrl,
  accessToken,
  reportPage,
}) => {
  let time: string = 'month';
  let chart: string = 'bars';

  const setFilterForVisual = async (embedObject: any) => {
    const pages = await embedObject?.getPages();

    const activePage = pages?.filter((page: any) => {
      return page.isActive;
    })[0];
    if (activePage) {
      const visuals: any = await activePage.getVisuals();
      const monthVisual: any = visuals.find((visual: any) => visual.page.isActive === true);

      if (monthVisual.page.displayName === 'Projects') {
        const visualFilters = await monthVisual.getFilters();
        if (visualFilters.length > 0) {
          monthVisual.page.setFilters([ProjectsDateFilters, ProjectsTenantFilters]);
        }
      }
      if (monthVisual.page.displayName === 'Total Spend') {
        const visualFilters = await monthVisual.getFilters();
        if (visualFilters.length > 0) {
          monthVisual.page.setFilters([TotalSpendDateFilters, TotalSpendFilters]);
        }
      }
      if (monthVisual.page.displayName === 'Suppliers') {
        const visualFilters = await monthVisual.getFilters();
        if (visualFilters.length > 0) {
          monthVisual.page.setFilters([SuppliersDateFilters, SuppliersFilters]);
        }
      }
    }
  };
  const reportConfig: IEmbedConfiguration = {
    type: 'report',
    embedUrl,
    tokenType: models.TokenType.Embed,
    accessToken,
    pageName: reportPage,
    settings: {
      filterPaneEnabled: false,
      persistentFiltersEnabled: true,
      navContentPaneEnabled: false,
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToPage,
      },
    },
  };

  const dispatch = useDispatch();
  // Map of event handlers to be applied to the embedding report
  const eventHandlersMap = new Map([
    [
      'loaded',
      () => {
        // loaded callback
        console.log('loaded');
      },
    ],
    [
      'rendered',
      async (event: any) => {
        const { powerBiEmbed } = event.target;
        const pages = await powerBiEmbed.getPages();
        const activePage = pages?.filter((page: any) => {
          return page.isActive;
        })[0];
        dispatch(setReportPage(activePage.displayName));
      },
    ],
    [
      'error',
      (event?: service.ICustomEvent<any>) => {
        // error callback
      },
    ],
    [
      'filtersApplied',
      (event?: service.ICustomEvent<any>) => {
        console.log('filtersApplied');
      },
    ],
    [
      'visualClicked',
      async (event?: any) => {
        const { powerBiEmbed } = event.target;
        const pages = await powerBiEmbed.getPages();
        const activePage = pages?.filter((page: any) => {
          return page.isActive;
        })[0];
        const visuals: any = await activePage.getVisuals();
        const monthVisual: any = visuals.find((visual: any) => visual.page.isActive === true);
        await monthVisual.removeFilters();
      },
    ],
    [
      'buttonClicked',
      async (event?: any) => {
        const { powerBiEmbed } = event.target;
        const pages = await powerBiEmbed.getPages();
        const activePage = pages?.filter((page: any) => {
          return page.isActive;
        })[0];

        if (
          event?.detail?.title === 'month' ||
          event?.detail?.title === 'quarter' ||
          event?.detail?.title === 'year' ||
          event?.detail?.title === 'bar' ||
          event?.detail?.title === 'line'
        ) {
          switch (event?.detail?.title) {
            case 'month':
              time = 'month';
              break;
            case 'quarter':
              time = 'quarter';
              break;
            case 'year':
              time = 'year';
              break;
            case 'bar':
              chart = 'bars';
              break;
            case 'line':
              chart = 'lines';
              break;
          }

          if (activePage.displayName === 'Internal Companies') {
            if (time === 'month' && chart === 'bars') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark8d9ffce07798985da918');
            } else if (time === 'month' && chart === 'lines') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark7936f2a277dbe8dc657e');
            } else if (time === 'year' && chart === 'bars') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark96458d902900c123530b');
            } else if (time === 'year' && chart === 'lines') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark5445acdb96057c003d28');
            } else if (time === 'quarter' && chart === 'bars') {
              await powerBiEmbed.bookmarksManager.apply('Bookmarkce3fd55e0d2801c6b2dd');
            } else if (time === 'quarter' && chart === 'lines') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark828eeee7106692184340');
            }
          }
          if (activePage.displayName === 'Projects') {
            if (time === 'month' && chart === 'bars') {
              await powerBiEmbed.bookmarksManager.apply('Bookmarkfa9357d54029b983a811');
            } else if (time === 'month' && chart === 'lines') {
              await powerBiEmbed.bookmarksManager.apply('Bookmarkf0b266d8218baafff577');
            } else if (time === 'year' && chart === 'bars') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark2a61b2b9e7b5461c8cf8');
            } else if (time === 'year' && chart === 'lines') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark449e9c53d06ba7347cdc');
            } else if (time === 'quarter' && chart === 'bars') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark64dab1fabd3b616533df');
            } else if (time === 'quarter' && chart === 'lines') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark2ed647fbb0ee5c94eea9');
            }
          }
          if (activePage.displayName === 'Total Spend') {
            if (time === 'month' && chart === 'bars') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark890ad150d67b58669304');
            } else if (time === 'month' && chart === 'lines') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark3e81f19a531c4d4f6a26');
            } else if (time === 'year' && chart === 'bars') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark521680dde97ad121d3ae');
            } else if (time === 'year' && chart === 'lines') {
              await powerBiEmbed.bookmarksManager.apply('Bookmarkeccbcea4b165ebda5582');
            } else if (time === 'quarter' && chart === 'bars') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark613bd86aff27a411cd4d');
            } else if (time === 'quarter' && chart === 'lines') {
              await powerBiEmbed.bookmarksManager.apply('Bookmark09d434533de95b6b7a2a');
            }
          }
        }
      },
    ],
    [
      'pageChanged',
      async (event: any) => {
        time = 'month';
        chart = 'bars';
      },
    ],
  ]);

  return (
    <>
      <PowerBIEmbed
        embedConfig={reportConfig}
        eventHandlers={eventHandlersMap}
        cssClassName="powerbi-report"
        getEmbeddedComponent={(embedObject: any) => {
          setTimeout(() => {
            setFilterForVisual(embedObject);
          }, 3000);
        }}
      />
    </>
  );
};
export default PowerBiReportLayout;
