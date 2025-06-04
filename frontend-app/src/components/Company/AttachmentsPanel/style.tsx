import { createStyles, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';

export default makeStyles((theme: Theme) =>
  createStyles({
    attachments: {
      justifyContent: 'space-between',
    },
    uploadFileButton: {
      marginLeft: '10px',
      color: '#12814b',
    },
    infoHead: {
      marginBottom: '1rem',
      color: '#000000',
      fontSize: '28px',
      fontweight: '500',
    },
    checkBox: {
      marginLeft: '10px',
      marginTop: '5px',
    },
    deleteButton: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&:active': {
        backgroundColor: 'transparent',
      },
      '&:focus': {
        boxShadow: 'none',
      },
    },
  })
);
