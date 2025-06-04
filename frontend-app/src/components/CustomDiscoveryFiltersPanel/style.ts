import { createStyles, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';

export default makeStyles((theme: Theme) =>
  createStyles({
    textCenter: {
      textAlign: 'center',
    },
    formControl: {},
    paper: {
      borderRadius: 10,
      padding: 15,
      paddingBottom: 50,
    },
    panelGroup: {
      marginLeft: 20,
      marginRight: 20,
    },
    importancePercentage: {
      marginTop: 10,
    },
  })
);
