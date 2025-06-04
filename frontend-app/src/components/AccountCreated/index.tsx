import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Typography, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useStyles from './style';

const AccountCreated = (props: RouteComponentProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.accountCreatedWrapper}>
      <div className={classes.accountCreated}>
        <img className={classes.logoImg} src="/stimuluslogo.png" alt="STIMULUS" />
      </div>
      <div className={classes.accountCreatedMessage}>
        <h2>{t('ACCOUNT CREATED!')}</h2>
        <Typography variant="body1" color="textSecondary" className={classes.accountCreatedMessageParagraph}>
          {t(
            'Congratulations! Your account has been successfully created. Do you have a company you want to create or join?'
          )}
        </Typography>
      </div>
      <div className={classes.accountCreatedAction}>
        <Button className={classes.button} variant="contained" color="primary">
          {t('CREATE COMPANY')}
        </Button>
        <Button className={classes.button} variant="contained" color="primary">
          {t('FINISH REGISTRATION')}
        </Button>
      </div>
    </div>
  );
};

export default AccountCreated;
