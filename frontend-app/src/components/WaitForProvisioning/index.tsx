import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './style';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { AuthContext } from '../../context/Auth/index';
import { Box, Button, Center } from '@chakra-ui/react';

const WaitForProvisioning = (props: { provisioningStatus: string; createNewTenantRedirect: () => void }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { logout } = useContext(AuthContext);
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.logoImg}>
          <img src="/stimuluslogo.png" alt="STIMULUS" />
        </div>
        <div className={classes.menuItem} onClick={() => logout()}>
          <ExitToAppIcon />
          <span>{t('Logout')}</span>
        </div>
      </div>
      <Center>
        <Box>
          <Typography>{t('We are working on provisioning. Come back later to use the app')}</Typography>
          <Typography>
            {t('Status')}:<b>{props.provisioningStatus}</b>
          </Typography>
          <Button data-testid="new-tenant-button" isFullWidth variant="solid" onClick={props.createNewTenantRedirect}>
            {t('Create another tenant')}
          </Button>
        </Box>
      </Center>
    </div>
  );
};

export default WaitForProvisioning;
