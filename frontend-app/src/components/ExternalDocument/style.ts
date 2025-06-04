import { makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: '1.5rem',
      padding: '1rem 0',
    },
    logo: {
      maxWidth: 100,
      maxHeight: 100,
      cursor: 'pointer',
      color: '#158048',
    },
    logoImg: {
      width: 100,
      height: 'auto',
    },
    icon: {
      fontSize: '7.188rem',
    },
    label: {
      fontWeight: 500,
    },
    formControl: {
      padding: '8px',
    },
    errorMessage: {
      color: 'red',
      fontSize: 10,
      top: '2px',
      position: 'relative',
      display: 'block',
    },
    button: {
      marginTop: '10px',
    },
  })
);
