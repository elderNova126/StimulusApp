import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    bodyAction: {
      userSelect: 'none',
      fontWeight: 'bold',
      fontSize: '13px',
      padding: '10px',
    },
    bodyActionItem: {
      cursor: 'pointer',
    },
    card: {
      marginTop: '100px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-evenly',
    },
    cardItem: {
      textAlign: 'center',
      borderRadius: '10px',
      border: '1px solid rgba(0, 0, 0, 0.12)',
      backgroundColor: '#FFF',
      margin: '12px',
    },
    cardHeader: {
      fontSize: '20px',
    },
    cardBody: {
      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
      padding: '0 49px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      height: '210px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    cardBodyItem: {
      '& p': {
        fontSize: '14px',
        fontFamily: 'Poppins',
      },
    },
    cardFooter: {
      padding: '0 30px 20px',
      fontWeight: 500,
    },
    button: {
      color: 'white',
    },
    header: {
      boxShadow:
        '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    },
    headerActions: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0 10px 20px',
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
    headerDataText: {
      textAlign: 'left',
      margin: '0 auto',
    },
  })
);
