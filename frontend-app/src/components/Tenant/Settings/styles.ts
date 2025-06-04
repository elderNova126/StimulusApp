import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: '2rem',
      margin: 'auto',
    },
    containerSmall: {
      padding: '2rem',
      width: '70%',
      margin: 'auto',
    },
    title: {
      color: 'red',
    },
    activeStatus: {
      background: 'green',
      width: '10px',
      height: '10px',
    },
    inactiveStatus: {
      background: 'red',
      width: '10px',
      height: '10px',
    },
    emptyResult: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '10px',
      padding: '2rem',
      background: 'lightgray',
    },
    apiKeyField: {
      color: 'red',
    },
  })
);
