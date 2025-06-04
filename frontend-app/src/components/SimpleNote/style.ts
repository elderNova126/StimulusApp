import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    body: {
      color: '#363635',
      fontFamily: 'Roboto',
      fontSize: '14px',
    },
    avatar: {
      marginTop: 12,
      marginBottom: 6,
      width: '73px',
      height: '73px',
      border: '1px solid #919482',
      backgroundColor: theme.palette.primary.main,
    },
    iconButton: {
      padding: '0 4px',
      minWidth: '24px',
      height: '24px',
      cursor: 'pointer',
      '&:hover': {
        color: 'green',
      },
      display: 'inline-block',
    },
    iconButtonActive: {
      padding: '0 4px',
      minWidth: '24px',
      height: '24px',
      color: 'green',
      cursor: 'pointer',
      display: 'inline-block',
    },
    iconSVG: {
      width: 21,
      height: 'auto',
    },
    editForm: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    username: {
      color: 'black',
    },
    margin1: {
      margin: theme.spacing(1),
    },
    noteContent: {
      flexGrow: 2,
      borderRadius: 20,
      padding: 15,
      backgroundColor: '#E9F8ED',
      minWidth: 250,
      maxWidth: 500,
    },
    noteBody: {
      color: 'black',
      fontSize: '13px',
      fontFamily: 'Roboto',
      lineHeight: '19px',
      letterSpacing: 0,
    },
    actions: {
      color: '#919482',
      fontSize: '13px',
      fontFamily: 'Roboto',
      lineHeight: '19px',
      letterSpacing: 0,
      display: 'flex',
      width: '100%',
    },
    time: {
      fontSize: '13px',
      minWidth: '85px',
    },
    transparentConnector: {
      '&.MuiTimelineConnector-root': {
        backgroundColor: 'transparent',
      },
    },
    connector: {
      '&.MuiTimelineConnector-root': {
        backgroundColor: '#E9F8ED',
        width: 2,
      },
    },
    seeMoreBtn: {
      color: 'black',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    errorMessage: {
      color: 'red',
      fontSize: 10,
      top: '2px',
      position: 'relative',
    },
    inputEdit: {
      '& fieldset': {
        border: 'none',
      },

      minWidth: 450,
      boxSizing: 'border-box',
      minHeight: '100px',
      borderRadius: '3px',
      backgroundColor: '#FFFFFF',
      boxShadow: 'inset 0 0px 1px 0 rgba(0,0,0,0.5)',
      '& .MuiInputBase-input.MuiOutlinedInput-input': {
        padding: '6.5px 14px',
      },
    },
  })
);
