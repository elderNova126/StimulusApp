import { makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    subtitle: {
      marginTop: '23px',
      marginBottom: '8px',
      marginLeft: '30px',
      fontSize: '12px',
      lineHeight: '18px',
      fontWeight: 'bold',
      color: '#919482',
      fontFamily: 'Poppins',
    },
    avatar: {
      marginLeft: 5,
    },
    betaFlag: {
      textOverflow: 'wrap',
      border: `1px solid 11B2BC`,
      padding: '2px 5px',
      marginLeft: '10px',
      boxShadow: `inset 0 -1px 0 11B2BC`,
      fontSize: '12px',
      lineHeight: '10px',
      borderRadius: '3px',
      verticalAlign: 'middle',
      backgroundColor: '#11B2BC',
      color: '#fff',
    },
    paper: {
      border: '1.3px solid #D2D7BB',
      borderRadius: '16px',
      paddingTop: '18px',
      paddingBottom: '6px',
      minHeight: 420,
    },
    panelTitle: {
      paddingBottom: '48px',
      fontSize: '20px',
      lineHeight: '30px',
      color: '#2A2A28',
    },
    scoreTitle: {
      fontSize: '20px',
      lineHeight: '30px',
      color: '#2A2A28',
      display: 'flex',
      alignItems: 'center',
    },
    welcomeMessage: {
      fontFamily: 'Open Sans',
      fontSize: '13px',
      lineHeight: '18px',
      color: '#919482',
    },
    username: {
      paddingLeft: 10,
      color: '#1BB062',
    },
    actionsRow: {
      display: 'flex',
      alignContent: 'flex-end',
      justifyContent: 'flex-end',
    },
    primaryButton: {
      position: 'relative',
      bottom: 0,
      marginRight: 20,
      background: theme.palette.primary.main,
      color: 'white',
      minWidth: '110px',
    },
    secondaryButton: {
      marginRight: 20,
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
    },
    chart: {
      height: 250,
    },
    homeWrapper: {
      marginTop: '50px',
      '& .MuiGrid-item:nth-of-type(1)': {
        paddingBottom: 0,
      },
    },
    container: {
      marginBottom: '50px',
    },
    card: {},
    cardContent: {
      padding: 0,
      minHeight: 340,
    },
  })
);
