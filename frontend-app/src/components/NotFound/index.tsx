import { Container, Grid, Paper, Typography } from '@material-ui/core';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import { Link, navigate, RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './style';

const NotFound = (props: RouteComponentProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => navigate('/companies/all/list/1'), 5000);
  }, []);

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" alignItems="center" alignContent="center" className={classes.container}>
        <Grid item xs={6} md={4}>
          <Paper className={classes.paper}>
            <Grid container justifyContent="center">
              <SentimentDissatisfiedIcon className={classes.icon} />
              <Grid item xs={12}>
                <Typography variant="h6">
                  {t('404! Page not found ')}
                  <Link to="/">{t('Click here')}</Link>
                  {t(' to go back to the home page or wait five seconds')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFound;
