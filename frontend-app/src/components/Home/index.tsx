import { Button, Card, CardActions, CardContent, Container, Grid, Paper, Typography } from '@material-ui/core';
import { navigate, RouteComponentProps } from '@reach/router';
import clsx from 'clsx';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TenantCompanyContext } from '../../context/TenantCompany';
import { useUser } from '../../hooks';
import { getCompanyName } from '../../utils/dataMapper';
import { UserAvatar } from '../GenericComponents';
import HomeAlertsTable from '../HomeAlertsTable';
import HomeCompaniesTable from '../HomeCompaniesTable';
import HomeProjectsTable from '../HomeProjectsTable';
import HomeStimulusScore from '../HomeStimulusScore';
import useStyles from './style';

const Home = (props: RouteComponentProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    user: { given_name = '', family_name = '', sub },
  } = useUser();
  const { tenantCompany } = useContext(TenantCompanyContext);
  const username = `${given_name} ${family_name}`;

  return (
    <Container className={classes.container} maxWidth="lg">
      <Grid container spacing={3} className={classes.homeWrapper}>
        <Grid container spacing={1} item xs={12}>
          <Grid item container xs={12} alignItems="center">
            <Typography component="span" color="textSecondary" className={classes.welcomeMessage}>
              {t('Welcome')}
            </Typography>
            <Typography
              component="span"
              className={clsx(classes.username, classes.welcomeMessage)}
              data-testid="home-username"
            >
              <b>{username}</b>
            </Typography>
            <UserAvatar userId={sub} className={classes.avatar} />
          </Grid>
          <Grid item xs={12}>
            <Typography component="span" color="textSecondary" className={classes.welcomeMessage}>
              {t('Company')}
            </Typography>
            <Typography component="span" className={clsx(classes.username, classes.welcomeMessage)}>
              <b>{tenantCompany && getCompanyName(tenantCompany)}</b>
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} className={classes.paper} data-testid="top-companies">
            <Card elevation={0} className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Grid container justifyContent="center" alignContent="center" alignItems="center">
                  <Typography variant="h5" className={classes.panelTitle}>
                    <b>{t('FAVORITES')}</b>
                  </Typography>
                  <Grid item xs={12}>
                    <HomeCompaniesTable />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Grid container justifyContent="flex-end" alignItems="center" item xs={12}>
                  <Button
                    disableElevation
                    className={classes.primaryButton}
                    variant="contained"
                    onClick={() => navigate('/companies')}
                  >
                    <b>{t('Manage')}</b>
                  </Button>
                </Grid>
              </CardActions>
            </Card>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} className={classes.paper} data-testid="active-projects">
            <Card elevation={0} className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Grid container justifyContent="center" alignContent="center" alignItems="center">
                  <Typography variant="h5" className={classes.panelTitle}>
                    <b>{t('ACTIVE PROJECTS')}</b>
                  </Typography>
                  <Grid item xs={12}>
                    <HomeProjectsTable />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Grid container justifyContent="flex-end" item xs={12}>
                  <Button
                    className={classes.secondaryButton}
                    variant="outlined"
                    onClick={() => navigate('/projects/create')}
                  >
                    <b>{t('Create Project')}</b>
                  </Button>
                  <Button
                    disableElevation
                    className={classes.primaryButton}
                    variant="contained"
                    onClick={() => navigate('/projects/1')}
                  >
                    <b>{t('Manage')}</b>
                  </Button>
                </Grid>
              </CardActions>
            </Card>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} className={classes.paper} data-testid="alerts">
            <Card elevation={0} className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Grid container justifyContent="center" alignContent="center" alignItems="center">
                  <Typography variant="h5" className={classes.panelTitle}>
                    <b>{t('ALERTS')}</b>
                  </Typography>
                  <Grid item xs={12}>
                    <HomeAlertsTable />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} className={classes.paper} data-testid="stimulus-score">
            <Card elevation={0} className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Grid container direction="column" justifyContent="space-between" alignItems="center">
                  <Grid item xs={12}>
                    <Typography variant="h5" className={classes.scoreTitle}>
                      <b>{t('STIMULUS SCORE')}</b>
                      <span className={classes.betaFlag}>Beta</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <HomeStimulusScore tenantCompany={tenantCompany} />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Grid container justifyContent="flex-end">
                  <Button
                    disableElevation
                    className={classes.primaryButton}
                    variant="contained"
                    onClick={() => navigate('/comparison')}
                  >
                    <b>{t('Review')}</b>
                  </Button>
                </Grid>
              </CardActions>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
