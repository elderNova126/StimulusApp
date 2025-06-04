import { Container, Grid, Typography } from '@material-ui/core';
import moment from 'moment';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import GenericChart from '../GenericChart';
import withScoreData from '../GenericChart/withScoreData';
import useStyles from './style';

const HomeStimulusScore = (props: { tenantCompany: any }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { tenantCompany } = props;
  const companies = tenantCompany ? [tenantCompany] : [];

  let PerformanceChart = null;
  const message = companies.length
    ? t('Last 6 Month Performance')
    : t('First you need to upload information about your company');

  if (companies && companies.length) {
    const metadata = {
      period: { from: moment().subtract(6, 'months'), to: moment() },
      metric: 'scoreValue',
      companies,
    };
    PerformanceChart = withScoreData({ WrappedComponent: GenericChart, metadata });
  }

  return (
    <div className={classes.root}>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={12} container justifyContent="center" alignContent="center">
            <Typography color="textSecondary" className={classes.message}>
              {message}
            </Typography>
          </Grid>
          <Grid item xs={12} container justifyContent="center" alignContent="center">
            {PerformanceChart ? <PerformanceChart width={450} height={250} /> : null}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default memo(HomeStimulusScore);
