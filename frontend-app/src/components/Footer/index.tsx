import { Typography } from '@material-ui/core';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import config from '../../config/environment.config';
import useStyles from './style';

const Footer = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      <Typography variant="body2" className={classes.footerText}>
        {t('Copyright ')}&copy; {t('2023. All Rights Reserved')}
      </Typography>
      <Typography className={clsx(classes.footerText, classes.version)}>
        <Link to="/change-log">{`v${config.version}`}</Link>
      </Typography>
    </div>
  );
};

export default Footer;
