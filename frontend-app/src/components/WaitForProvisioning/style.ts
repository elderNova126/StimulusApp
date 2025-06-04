import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
    },
    header: {
      boxShadow:
        '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
      height: '5%',
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
      alignItems: 'center',
    },
    headerDataText: {
      width: '300px',
      textAlign: 'left',
      margin: '0 auto',
    },
    body: {
      height: '90%',
    },
    paper: {
      padding: 20,
    },
    button: {
      marginTop: 20,
      background: theme.palette.primary.main,
      color: 'white',
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
  })
);
