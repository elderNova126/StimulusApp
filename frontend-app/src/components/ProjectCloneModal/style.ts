import { createStyles, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '1000px',
    },
    saveBtn: {
      marginBottom: 10,
      color: '#fff',
      fontWeight: 600,
      fontFamily: 'Poppins',
    },
    formGroup: {
      flexDirection: 'row',
    },
    cancelBtn: {
      marginBottom: 10,
      color: '#1BB062',
      fontFamily: 'Poppins',
      fontSize: '16px',
      letterSpacing: '0',
      lineHeight: '25px',
      fontWeight: 400,
    },
    formControlLabel: {
      flex: '1 0 43%',
      color: '#4A4A4A',
      fontFamily: 'Avenir Next',
      fontSize: '14px',
      letterSpacing: 0,
      lineHeight: '19px',
    },
    title: {
      color: '#000000',
      fontFamily: 'Poppins',
      fontSize: '20px',
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: '30px',
      textAlign: 'center',
    },
    label: {
      color: '#919482',
      fontFamily: 'Poppins',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: '21px',
      marginBottom: '8px',
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
    errorMessage: {
      color: 'red',
      fontSize: 10,
      top: '2px',
      position: 'relative',
    },
  })
);
