import { RouteComponentProps } from '@reach/router';
import { FC, useEffect, useState } from 'react';
import { EventHandler, PowerBIEmbed } from 'powerbi-client-react';
import { IEmbedConfiguration, models } from 'powerbi-client';
import { useTenantCompany } from '../../hooks';
import ReportDataQueries from '../../graphql/Queries/ReportDataQueries';
import { useLazyQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import LoadingScreen from '../LoadingScreen';

const { GET_REPORT_DATA } = ReportDataQueries;

const PBReportLayout: FC<RouteComponentProps> = (RouteComponentProps) => {
  const [loading, setLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [reportPage, setReportPage] = useState('');
  const { tenantName } = useTenantCompany();

  const [getReportData] = useLazyQuery(GET_REPORT_DATA, {
    fetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const {
        reportData: {
          reportData: { accessToken, embedUrl, reportPage },
        },
      } = data;
      setEmbedUrl(embedUrl);
      setAccessToken(accessToken);
      setReportPage(reportPage);
    },
  });

  useEffect(() => {
    if (tenantName) {
      getReportData({ variables: { tenantName } });
    }
  }, [tenantName]);

  const reportConfig: IEmbedConfiguration = {
    type: 'report',
    embedUrl,
    tokenType: models.TokenType.Embed,
    accessToken,
    pageName: reportPage,
    settings: {
      filterPaneEnabled: false,
      persistentFiltersEnabled: true,
      navContentPaneEnabled: true,
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToPage,
      },
    },
  };

  const eventHandlers: Map<string, EventHandler> = new Map([['rendered', () => setLoading(false)]]);

  return (
    <>
      <Box p="5rem 4rem 0 4rem" position="relative">
        <Box display={loading ? 'none' : 'block'}>
          <PowerBIEmbed embedConfig={reportConfig} eventHandlers={eventHandlers} cssClassName="powerbi-report" />
        </Box>
        {loading && <LoadingScreen />}
      </Box>
    </>
  );
};

export default PBReportLayout;
