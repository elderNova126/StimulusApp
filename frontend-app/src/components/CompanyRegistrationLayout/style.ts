import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    header: {},
    headerData: {
      width: '400px',
      margin: '0 auto',
      textAlign: 'center',
      paddingBottom: '12px',
    },
    headerActions: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0 10px 20px',
    },
    logoImg: {
      '& img': {
        width: '100px',
        height: 'auto',
        padding: '5px 5px 5px 5px',
      },
      cursor: 'pointer',
      alignItems: 'center',
    },
    menuItem: {
      padding: '5px 10px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      fontSize: '13px',
      '&:hover': {
        color: '#1BB062',
      },
    },
    stepText: {
      margin: '0 auto',
      marginBottom: '16px',
      color: '#7A7D72',
      fontFamily: 'Roboto',
      fontSize: '14px',
      letterSpacing: 0,
      lineHeight: '14px',
      textAlign: 'center',
    },
    subtitle: {
      margin: '0 auto',
      color: '#7A7D72',
      fontFamily: 'Roboto',
      fontSize: '12px',
      letterSpacing: 0,
      lineHeight: '14px',
      textAlign: 'center',
    },
    title: {
      position: 'relative',
      textAlign: 'center',
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '30px',
      color: '#2A2A28',
      letterSpacing: 0,
      marginBottom: '8px',
      marginTop: '12px',
    },
    body: {
      borderTop: '1px solid #D2D7BB',
      backgroundColor: '#F9FEFB',
      height: '80vh',
    },
  })
);
