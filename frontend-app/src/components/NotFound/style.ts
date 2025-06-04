import { makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '80vh',
    },
    paper: {
      padding: 25,
    },
    icon: {
      fontSize: '7.188rem',
      color: theme.palette.primary.main,
    },
  })
);
