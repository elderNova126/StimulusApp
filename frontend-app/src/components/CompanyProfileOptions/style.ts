import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    popupItem: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      '&:nth-last-child(1)': {
        border: 'none',
      },
    },
    popupItemHeader: {
      display: 'flex',
      color: '#1BB062',
      alignItems: 'center',
    },
    active: {
      color: '#1BB062',
    },
    actionItem: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    showDetailsIcon: {
      verticalAlign: 'middle',
    },
    typography: {
      padding: theme.spacing(2),
      border: '1px solid #D2D7BB',
      borderRadius: '5px',
      background: '#F9FEFB',
    },
    popupItemHeaderName: {
      width: '100%',
      padding: '6px',
      color: '#1BB062',
      fontFamily: 'Poppins',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: '18px',
    },
    popupItemBody: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    popupItemBodyItem: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '13px',
      marginLeft: '20px',
      padding: '5px 0',
    },
    profileOptions: {
      border: '0',
      background: 'unset',
      boxShadow: 'unset',
      fontWeight: 'bold',
      color: '#1BB062',
      padding: '0',
      '&:hover': {
        boxShadow: 'unset',
        background: 'unset',
      },
    },
    icon: {
      fontSize: '14px',
    },
  })
);
