import React from 'react';
import { Button, Container } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useStyles from './style';

interface PickPlanProps {
  next: () => void;
  prev: () => void;
  planHook: [string, (plan: string) => void];
}
const PickPlan = (props: PickPlanProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    next,
    prev,
    planHook: [, setPlan],
  } = props;

  return (
    <div data-testid="pick-plan-component">
      <div className={classes.bodyAction} onClick={prev}>
        <span className={classes.bodyActionItem}>{t('< Back')}</span>
      </div>
      <Container maxWidth="md">
        <div className={classes.card}>
          <div className={classes.cardItem}>
            <h2 className={classes.cardHeader}>{t('Standard')}</h2>
            <div className={classes.cardBody}>
              <div className={classes.cardBodyItem}>
                <p>{t('1 Data Source')}</p>
                <p>{t('3 Collaborators')}</p>
                <p>{t('3 Scenarios')}</p>
              </div>
              <div className={classes.cardBodyItem}>
                <p>{t('1 Support Ticket per Month')}</p>
              </div>
            </div>
            <div className={classes.cardFooter}>
              <h3>{`${t('Price')}: ${t('$1000 per year')}`}</h3>
              <Button
                className={classes.button}
                disableElevation
                fullWidth
                variant="contained"
                color="primary"
                data-testid="standard-plan-button"
                onClick={() => {
                  setPlan('standard');
                  next();
                }}
              >
                {t('Select Plan')}
              </Button>
            </div>
          </div>
          <div className={classes.cardItem}>
            <h2 className={classes.cardHeader}>{t('Premium')}</h2>
            <div className={classes.cardBody}>
              <div className={classes.cardBodyItem}>
                <p>{t('3 Data Source')}</p>
                <p>{t('10 Collaborators')}</p>
                <p>{t('10 Scenarios')}</p>
              </div>
              <div className={classes.cardBodyItem}>
                <p>{t('5 Support Ticket per Month')}</p>
              </div>
            </div>
            <div className={classes.cardFooter}>
              <h3>{`${t('Price')}: ${t('$2000 per year')}`}</h3>
              <Button
                className={classes.button}
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {
                  setPlan('premium');
                  next();
                }}
              >
                {t('Select Plan')}
              </Button>
            </div>
          </div>
          <div className={classes.cardItem}>
            <h2 className={classes.cardHeader}>{t('Premium +')}</h2>
            <div className={classes.cardBody}>
              <div className={classes.cardBodyItem}>
                <p>{t('Unlimited Data Source')}</p>
                <p>{t('Unlimited Collaborators')}</p>
                <p>{t('Unlimited Scenarios')}</p>
              </div>
              <div className={classes.cardBodyItem}>
                <p>{t('24 Hour Support')}</p>
              </div>
            </div>
            <div className={classes.cardFooter}>
              <h3>{t('Contact Us')}</h3>
              <Button
                className={classes.button}
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {
                  setPlan('premium_plus');
                  next();
                }}
              >
                {t('Select Plan')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PickPlan;
