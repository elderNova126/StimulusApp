import { makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '150px',
      width: '100%',
      overflow: 'auto',
      maxHeight: '300px',
      backgroundColor: '#f6f6f6',
    },
    modalheader: {
      backgroundColor: '#f6f6f6',
      fontSize: '18px',
      fontWeight: 'normal',
    },
    modalContent: {
      padding: '1rem 0rem',
      backgroundColor: '#f6f6f6',
    },
    actions: {
      display: 'flex',
    },
    listEmpty: {
      width: '100%',
    },
    divider: {
      borderBottom: '1px solid #D4D4D4',
      width: '90%',
      margin: '0 auto',
    },
  })
);
