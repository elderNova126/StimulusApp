import { makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      padding: '1rem 0rem',
      margin: '0 auto',
      justifyContent: 'space-between',
      borderBottom: '1px solid #D4D4D4',
    },
    title: {
      fontSize: '16px',
      color: '#2A2A28',
    },
    subtitle: {
      fontSize: '12px',
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      fontSize: '14px',
    },
    actionButton: {
      fontStyle: 'underline',
      marginLeft: '1rem',
      color: '#2A2A28',
      textDecoration: 'underline',
      fontSize: '13px',
    },
    count: {
      color: 'gray',
    },
    userAvatar: {
      marginRight: '.5rem',
    },
    actionsContainer: {
      display: 'flex',
      alignItems: 'start',
    },
    extraInfo: {
      margin: '.5rem 0rem',
      fontSize: '12px',
    },
  })
);
