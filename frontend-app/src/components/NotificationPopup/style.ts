import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    closeBtn: {
      padding: 0,
      paddingLeft: 5,
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.primary.main,
    },
  })
);
