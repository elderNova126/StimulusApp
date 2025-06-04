import { makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    content: {
      textAlign: 'center',
      minHeight: 200,
    },
    title: {
      color: '#000000',
      fontDamily: 'Poppins',
      fontSize: '20px',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: '27px',
      textAlign: 'center',
    },
    actionBtn: {
      padding: '0 10px',
      color: '#1BB062',
      fontFamily: 'Poppins',
      fontSize: '14px',
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: '21px',
    },
    dangerColor: {
      color: '#F7243E',
    },
    avatar: {
      width: 30,
      height: 30,
      fontSize: 16,
      border: '1px solid #919482',
      backgroundColor: theme.palette.primary.main,
    },
    username: {
      color: '#000000',
      fontFamily: 'Poppins',
      fontSize: '16px',
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: '25px',
    },
    userTitle: {
      color: '#919482',
      fontFamily: 'Roboto',
      fontSize: '14px',
      letterSpacing: '0',
      lineHeight: '16px',
    },
  })
);
