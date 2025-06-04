import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    body: {},
    bodyAction: {
      userSelect: 'none',
      fontWeight: 'bold',
      fontSize: '13px',
      padding: '10px',
    },
    bodyActionItem: {
      cursor: 'pointer',
    },
    formWrapper: {
      width: '400px',
      margin: '20px auto 0',
      textAlign: 'center',
    },
    form: {
      textAlign: 'left',
      marginTop: '20px',
      padding: '20px',
      border: '1px solid #D2D7BB',
      borderRadius: '12px',
      backgroundColor: '#fff',
    },
    formItem: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '15px',
      '&:last-child': {
        marginBottom: '0',
        marginTop: '25px',
      },
      '& input': {
        backgoundColor: '#fff',
      },
    },
    label: {
      color: 'rgba(0, 0, 0, 0.54)',
      fontWeight: 500,
      fontSize: '12px',
      marginBottom: '5px',
    },
    data: {
      marginLeft: '20px',
      color: 'rgba(0, 0, 0, 0.54)',
    },
    button: {
      color: 'white',
    },
    errorMessage: {
      color: 'red',
      fontSize: 10,
      top: '2px',
      position: 'relative',
    },
  })
);
