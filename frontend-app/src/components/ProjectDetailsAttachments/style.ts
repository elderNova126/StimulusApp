import { createStyles, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

export default makeStyles((theme: Theme) =>
  createStyles({
    uploadFileButton: {
      paddingLeft: '20px',
      paddingRight: '20px',
      marginBottom: '15px',
      marginLeft: '15px',
      background: theme.palette.primary.main,
      color: 'white',
      borderRadius: '6px',
    },
    relative: {
      position: 'relative',
    },
    btnLoading: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
    chooseFileButton: {
      paddingLeft: '40px',
      paddingRight: '40px',
      marginBottom: '15px',
      background: theme.palette.primary.main,
      color: 'white',
      borderRadius: '6px',
    },
    infoHeading: {
      padding: '5px 0',
      color: '#919482',
      fontFamily: 'Poppins',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: '18px',
      marginBottom: '5px',
    },
    infoData: {
      color: 'gray',
      padding: '5px 0',
      wordBreak: 'break-word',
      fontFamily: 'Roboto',
      fontSize: '13px',
      letterSpacing: 0,
      lineHeight: '18px',
    },
    uploadFileInput: {
      display: 'none',
    },
  })
);
