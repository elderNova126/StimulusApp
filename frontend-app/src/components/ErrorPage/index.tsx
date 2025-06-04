import { Container, Grid, Paper, Typography } from '@material-ui/core';
import { Link, RouteComponentProps } from '@reach/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './style';

const ErrorPage = (props: RouteComponentProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" alignItems="center" alignContent="center" className={classes.container}>
        <Grid item xs={6} md={4}>
          <Paper className={classes.paper}>
            <Grid container justifyContent="center">
              <img src="https://ui.getstimulus.io/logo.png" width="200" alt="Stimulus Logo" />
              <Grid item xs={12}>
                <Typography variant="h6">
                  {t('There was an unexpected error, please try again. ')}
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

export default ErrorPage;
