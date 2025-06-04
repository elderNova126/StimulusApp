import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 15,
    },
    expandText: {
      fontSize: '16px',
      marginLeft: '5px',
    },
    icon: {
      color: theme.palette.primary.main,
    },
    addBtn: {
      fontSize: '12px',
      '& .MuiButton-iconSizeMedium > *:first-child': {
        fontSize: '15px',
      },
    },
    container: {
      display: 'flex',
    },
    textarea: {
      width: '100%',
      resize: 'none',
      color: '#4A4A4A',
      fontFamily: 'Avenir',
      fontSize: '20px',
      letterSpacing: 0,
      lineHeight: '20px',
      boxSizing: 'border-box',
      padding: '18px',
      outlineColor: theme.palette.primary.main,
      height: '36px',
      border: '1px solid #979797',
      borderRadius: '3px',
      backgroundColor: '#FFFFFF',
      boxShadow: 'inset 0 0px 1px 0 rgba(0,0,0,0.5)',
    },
    formContainer: {
      padding: '5px',
    },
    saveBtn: {
      color: 'white',
      margin: 5,
      marginLeft: 0,
    },
    cancelBtn: {
      color: 'white',
      margin: 5,
    },
    errorMessage: {
      color: 'red',
      fontSize: 10,
      top: '2px',
      position: 'relative',
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
  })
);
