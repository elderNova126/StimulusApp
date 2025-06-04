import { useQuery } from '@apollo/client';
import { CircularProgress, Typography } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertsContext } from '../../context/Alert/index';
import AlertQueries from '../../graphql/Queries/NotificationQueries';
import GenericTable from '../GenericTable';
import { EventCode, NotificationMessage } from '../NotificationPopup/index';
import useStyles from './style';
const { HOME_ALERTS_GQL } = AlertQueries;

const alertMomentToString = (timestamp: string, t: any): string => {
  const now = moment.utc();
  switch (now.diff(new Date(timestamp), 'days')) {
    case 1:
      return t('Today');
    case 2:
      return t('Yesterday');
    default:
      return moment(new Date(timestamp)).format('MM/DD/YYYY');
  }
};

const HomeAlertsTable = (props: RouteComponentProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { loading, data } = useQuery(HOME_ALERTS_GQL, { fetchPolicy: 'cache-first' });
  const { newAlerts } = useContext(AlertsContext);
  const [alerts, setAlerts] = useState([]);

  let renderAlerts;
  useEffect(() => {
    if (data?.notifications?.results?.length) {
      setAlerts(data?.notifications?.results);
    }
  }, [data, setAlerts]);

  useEffect(() => {
    if (newAlerts.length) {
      setAlerts([...newAlerts, ...alerts]);
    }
  }, [newAlerts.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    renderAlerts = (
      <div className={classes.loader}>
        <CircularProgress data-testid="loading" />
      </div>
    );
  } else if (alerts?.length) {
    const content = {
      loading: false,
      showHeaders: false,
      headers: [
        {
          label: t('Recent events'),
          mappedKey: 'body',
          subtitleKey: 'timestamp',
          keyClass: classes.title,
          subtitleClass: classes.subtitle,
        },
      ],
      rows: alerts
        .map(({ event: alert }: any) => {
          return (
            alert?.code in EventCode && {
              ...alert,
              body: <NotificationMessage alert={alert} />,
              timestamp: alertMomentToString(alert.created, t),
            }
          );
        })
        .filter((i) => i),
    };

    renderAlerts = <GenericTable className={classes.root} variant="regular" content={content} />;
  } else {
    renderAlerts = (
      <Typography variant="body1" color="textSecondary" className={classes.noAlerts}>
        {t("You don't have any alerts at this moment!")}
      </Typography>
    );
  }

  return <div className={classes.root}>{renderAlerts}</div>;
};

export default HomeAlertsTable;
