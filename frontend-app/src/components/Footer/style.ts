import { makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      position: 'absolute',
      marginTop: 'auto',
      bottom: 0,
      backgroundColor: '#15844B',
      color: 'white',
      width: '100%',
      height: '65px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerText: {
      fontFamily: 'Poppins',
      color: '#FFFFFF',
      fontSize: '12px',
      fontWeight: 300,
      letterSpacing: 0,
      lineHeight: '18px',
    },
    version: {
      '& a': {
        color: '#fff',
        textDecoration: 'none',
      },
      fontSize: '10px',
    },
  })
);
