import { makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
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
    filters: {
      minHeight: '71vh',
      backgroundColor: '#F9FEFB',
      padding: 10,
      paddingBottom: 40,
    },
    divider: {
      width: '100%',
      margin: '10px 0',
    },
    dateConnector: {
      textAlign: 'center',
      color: '#919482',
      fontFamily: 'Poppins',
      fontSize: '13px',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: '20px',
    },
    label: {
      paddingTop: 24,
      paddingBottom: 12,
      color: '#919482',
      fontFamily: 'Poppins',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: '0',
      lineHeight: '18px',
    },
  })
);
