import { CircularProgress, Grid, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './style';

const NewUserStatus = (props: {
  waitForProvisioning: boolean;
  provisioningStatus: string;
  createNewTenantRedirect: () => void;
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container justifyContent="center" alignContent="center" className={classes.body}>
        <Paper elevation={0} className={classes.paper}>
          <Grid container alignItems="center" spacing={3} direction="column">
            <Grid item xs={12}>
              <Typography>{t('Thank you! Your user account has been successfully created.')}</Typography>
            </Grid>
            <Grid item xs={12}>
              <CircularProgress />
            </Grid>
            <Grid item xs={12}>
              <Typography>{t('It can take up to one business day for your account access to be enabled.')}</Typography>
              <Typography>
                {t(' Please contact ')}
                <a href="mailto:support@getstimulus.io" data-testid="mail-link">
                  support@getstimulus.io
                </a>
                {t(' in case of any questions.')}
              </Typography>
            </Grid>
          </Grid>
          {/* {waitForProvisioning ? (
            <React.Fragment>
              <Typography>{t('We are working on provisioning. Come back later to use the app')}</Typography>
              <Typography>
                {t('Status')}:<b>{'' + props.provisioningStatus}</b>
              </Typography>
            </React.Fragment>
          ) : (
            <Typography>{t('Your account is created, you can start by creating your company')}</Typography>
          )}
          <div className={classes.actions}>
            <Button
              disableElevation
              className={classes.button}
              variant="contained"
              onClick={props.createNewTenantRedirect}
            >
              {waitForProvisioning ? t('Create another company') : t('Create your first company')}
            </Button>
            <Button
              disableElevation
              className={clsx(classes.button, classes.secondary)}
              onClick={() => {
                requestAccess().then(
                  ({
                    data: {
                      requestAccess: { success },
                    },
                  }) => {
                    if (success) {
                      enqueueSnackbar('Request access successfully', { variant: 'success' });
                    } else {
                      enqueueSnackbar('There was an error, please try again later.', { variant: 'error' });
                    }
                  }
                );
              }}
              variant="contained"
            >
              {t('Request access')}
            </Button>
          </div> */}
        </Paper>
      </Grid>
    </div>
  );
};

export default NewUserStatus;
