import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './style';
import { Typography } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Footer from '../Footer/index';
import { AuthContext } from '../../context/Auth/index';

const CompanyRegistrationLayout = (props: { stepText?: string; title?: string; subtitle?: string; children: any }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { logout } = useContext(AuthContext);
  return (
    <React.Fragment>
      <div className={classes.header}>
        <div className={classes.headerActions}>
          <div className={classes.logoImg} onClick={() => window.location.reload()}>
            <img src="/stimuluslogo.png" alt="STIMULUS" />
          </div>
          <div className={classes.menuItem} onClick={() => logout()}>
            <ExitToAppIcon />
            <span>{t('Logout')}</span>
          </div>
        </div>
        <div className={classes.headerData}>
          <Typography className={classes.stepText}>{props.stepText}</Typography>
          <Typography className={classes.title}>{props.title}</Typography>
          <Typography className={classes.subtitle}>{props.subtitle}</Typography>
        </div>
      </div>
      <div className={classes.body}>{props.children}</div>
      <Footer />
    </React.Fragment>
  );
};

export default CompanyRegistrationLayout;
