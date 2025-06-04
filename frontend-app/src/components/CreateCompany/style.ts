import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    body: {
      marginTop: '50px',
    },
    formWrapper: {
      width: '40vw',
      maxWidth: '500px',
      minWidth: '400px',
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
    },
    label: {
      color: 'rgba(0, 0, 0, 0.54)',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    data: {
      marginLeft: '20px',
      color: 'rgba(0, 0, 0, 0.54)',
    },
    input: {
      '& fieldset': {
        border: 'none',
      },
      boxSizing: 'border-box',
      height: '36px',
      border: '1px solid #979797',
      borderRadius: '3px',
      backgroundColor: '#FFFFFF',
      boxShadow: 'inset 0 0px 1px 0 rgba(0,0,0,0.5)',
      '& .MuiInputBase-input.MuiOutlinedInput-input': {
        padding: '6.5px 14px',
      },
    },
    button: {
      color: 'white',
    },
    title: {
      color: '#4F5A64',
      fontSize: '16px',
      fontWeight: 500,
      fontFamily: 'Poppins',
      paddingBottom: '8px',
    },
    subtitle: {
      color: '#7A7D72',
      fontSize: '12px',
      fontFamily: 'Poppins',
    },
    errorMessage: {
      color: 'red',
      fontSize: 10,
      top: '2px',
      position: 'relative',
    },
  })
);
