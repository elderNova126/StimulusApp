import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    accountCreatedWrapper: {
      width: '350px',
      textAlign: 'center',
      margin: '0 auto',
      height: 'calc(100vh - 200px)',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    accountCreated: {},
    logoImg: {},
    accountCreatedMessage: {
      marginBottom: '20px',
    },
    accountCreatedAction: {
      display: 'flex',
      flexDirection: 'column',
    },
    accountCreatedMessageParagraph: {
      textAlign: 'left',
    },
    button: {
      color: 'white',
      '&:last-child': {
        marginTop: '10px',
      },
    },
  })
);
